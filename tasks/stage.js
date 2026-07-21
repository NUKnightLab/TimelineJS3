const prompt = require('prompt'),
    simpleGit = require('simple-git'),
    fse = require('fs-extra'),
    path = require('path'),
    AdmZip = require('adm-zip'),
    glob = require('glob'),
    _template = require('lodash/template');

const CDN_ROOT = '../cdn.knightlab.com', // maybe parameterize later
    PROJECT_NAME = 'timeline3'; // can we read this from package.json?

function makeCDNPath(version) {
    return path.normalize(path.join(CDN_ROOT, 'app/libs', PROJECT_NAME, version));
}

function writeBanner(file, options) {
    let pkginfo = require(path.join('../package.json'))
    pkginfo['year'] = new Date().getFullYear()
    Object.keys(options).forEach(k => {
        pkginfo[k] = options[k]
    })
    let banner = fse.readFileSync(options['banner'], 'utf-8')
    let template = _template(banner)
    let rendered = template(pkginfo)
    let contents = fse.readFileSync(file, 'utf-8')
    fse.writeFileSync(file, rendered + contents)
}

function stageToCDN(version, latest) {
    var banner_version = (version == 'dev') ? new Date().toISOString() : version;

    // var to_banner = glob.sync('dist/**/*.+(js|css)');
    // for (var i = 0; i < to_banner.length; i++) {
    //     writeBanner(to_banner[i], {
    //         banner: 'banner.tmpl',
    //         version: banner_version,
    //     })
    // }

    // backwards compatibility -- we've offered timeline-min.js
    // webpack makes something smaller even than that, so just copy.
    // for people who want to debug, there's the sourcemap.
    fse.copySync('dist/js/timeline.js', 'dist/js/timeline-min.js')

    if (fse.existsSync(CDN_ROOT)) {
        var dest = makeCDNPath(version);
        var zip = new AdmZip();
        zip.addLocalFolder('dist', PROJECT_NAME);
        zip.writeZip(path.join('dist', PROJECT_NAME + ".zip"));
        fse.copySync('dist', dest, onErr);
        console.log('copied to ' + dest);

        if (latest) {
            var latest_dir = makeCDNPath('latest');
            fse.removeSync(latest_dir);
            fse.copySync(dest, latest_dir, onErr);
            console.log('copied version ' + version + ' to latest');
        }

    } else {
        console.error("CDN directory " + CDN_ROOT + "does not exist; nothing was copied")
    }
}

if (process.argv[2] == 'dev') {
    stageToCDN('dev')
} else {
    // if not 'dev' then ask for a new tag, update package.json, and tag the git repository
    simpleGit().tags(function(_, tagList) {
        if (tagList.latest) {
            console.log("The last tag used was " + tagList.latest);
        } else {
            console.log("No tagged versions yet.")
        }
        prompt.start();

        var properties = [{
            name: 'version',
            validator: /^\d+\.\d+\.\d+$/,
            message: "Enter the new version/tag",
            warning: "Tags must be three numbers separated by dots, and not have been used before.",
            conform: function(value) {
                return tagList && tagList.all && tagList.all.indexOf(value) == -1;
            }
        }];

        prompt.get(properties, function(err, result) {
            if (err) { return onErr(err); }
            var package_json = require('../package.json');
            if (package_json.version != result.version) {
                package_json.version = result.version;
                fse.writeJsonSync('package.json', package_json, { spaces: 4 });
                simpleGit().commit(`Update to ${result.version}`, ['package.json'])
            }
            simpleGit().addTag(result.version)
                .pushTags('origin', function() {
                    console.log('  Tagged with: ' + result.version);
                    var latest = ("latest" == process.argv[2]); // maybe later use a CLI arg parser
                    stageToCDN(result.version, latest);
                });
        })
    })
}

function onErr(err) {
    console.error(err);
    return 1;
}