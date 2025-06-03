// TBH, not 100% what a liquid filter is yet. 

// module.exports = function(eleventyConfig) {
   
//         });
// };

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("static/**/*");
    // eleventyConfig.addPassthroughCopy("**/*.js");
    eleventyConfig.addPassthroughCopy("js");
    // add custom Liquid filter named "safe"
    eleventyConfig.addFilter("safe", function(content){
        return content; 
    });

    eleventyConfig.addFilter("dist_url", function(content){
        const PREFIXES = {
            'stg': 'https://cdn.knightlab.com/libs/timeline3/dev/',
            'prd': 'https://cdn.knightlab.com/libs/timeline3/latest/',
        }
        let prefix = PREFIXES[process.env.DEPLOY_TARGET] || '/dist/';
        return `${prefix}${content}`;
    });    

    return eleventyConfig;
   
  };
