const fse = require('fs-extra'),
    path = require('path'),
    AdmZip = require('adm-zip');

const CDN_ROOT = '../cdn.knightlab.com', // maybe parameterize later
    PROJECT_NAME = 'timeline3'; // can we read this from package.json?

function makeCDNPath(version) {
    return path.normalize(path.join(CDN_ROOT, 'app/libs', PROJECT_NAME, version));
}

function stageToCDN(version, latest) {
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

function onErr(err) {
    console.error(err);
    return 1;
}

if (process.argv[2] == 'dev') {
    stageToCDN('dev')
} else {
    // version and git tag are expected to already be set via `npm version` (see RELEASING.md)
    var package_json = require('../package.json');
    var version = package_json.version;
    console.log('Staging version ' + version + ' to CDN');
    var latest = ("latest" == process.argv[2]); // maybe later use a CLI arg parser
    stageToCDN(version, latest);
}
