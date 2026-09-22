const fs = require('fs-extra')
const less = require('less')
const path = require('path')
const glob = require('glob')

let main_output_dir = path.resolve(__dirname, '../dist/css')
fs.ensureDirSync(main_output_dir, { recursive: true })

/*
 * Copy support files (only the actual font files - src/css/icons also
 * holds icon-font-generator artifacts like selection.json/icons.html
 * that were never part of the webpack build either)
 */
const icon_src_dir = path.resolve(__dirname, '../src/css/icons')
const icon_output_dir = path.join(main_output_dir, 'icons')
fs.ensureDirSync(icon_output_dir, { recursive: true })
glob.sync(path.join(icon_src_dir, "tl-icons.*")).forEach((p) => {
    fs.copySync(p, path.join(icon_output_dir, path.basename(p)))
    console.log(`Icon copied ${p}`)
})

/*
 * Compile base CSS
 */
let base_css_path = path.resolve(__dirname, '../src/less/TL.Timeline.less')
let base_css_content = fs.readFileSync(base_css_path, 'utf-8')
less.render(base_css_content, {
    filename: base_css_path,
    sourceMap: {}
}).then(
    (output) => {
        var output_css = path.join(main_output_dir, `timeline.css`)
        fs.writeFileSync(output_css, output.css)
        if (output.map) {
            fs.writeFileSync(`${output_css}.map`, output.map)
        }
        console.log(`BASE CSS compiled ${base_css_path}`)
    },
    (error) => {
        console.log(`base css: error compiling ${base_css_path}`, error)
    }
)


/*
 * Compile font files 
 */
const font_src_dir = path.resolve(__dirname, '../src/less/fonts')
const font_output_dir = path.resolve(__dirname, '../dist/css/fonts')
fs.ensureDirSync(font_output_dir, { recursive: true })
glob.sync(path.join(font_src_dir, "font.*.less")).forEach((p) => {
    let file_content = fs.readFileSync(p, 'utf-8')
    less.render(file_content, {
        filename: p
    }).then(
        (output) => {
            var basename = path.basename(p, '.less')
            var output_css = path.join(font_output_dir, `${basename}.css`)
            fs.writeFileSync(path.join(output_css), output.css)
            console.log(`FONT CSS compiled ${p}`)
        },
        (error) => {
            console.log(`fonts: error compiling ${p}`, error)
        }
    )
})

/*
 * Compile themes
 */
const theme_src_dir = path.resolve(__dirname, '../src/less/themes')
const theme_output_dir = path.resolve(__dirname, '../dist/css/themes')
fs.ensureDirSync(theme_output_dir, { recursive: true })
glob.sync(path.join(theme_src_dir, "**/TL.Theme.*.less")).forEach((p) => {
    let file_content = fs.readFileSync(p, 'utf-8')
    less.render(file_content, {
        filename: p
    }).then(
        (output) => {
            var theme_name = p.split('/').slice(-2, -1)
            var output_css = path.join(theme_output_dir, `timeline.theme.${theme_name}.css`)
            fs.writeFileSync(output_css, output.css)
            console.log(`THEME CSS compiled ${p}`)
        },
        (error) => {
            console.log(`themes: error compiling ${p}`, error)
        }
    )
})