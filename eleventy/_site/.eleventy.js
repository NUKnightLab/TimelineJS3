// TBH, not 100% what a liquid filter is yet. 

// module.exports = function(eleventyConfig) {
   
//         });
// };

module.exports = function (eleventyConfig) {
    eleventyConfig.addPassthroughCopy("static");
    eleventyConfig.addPassthroughCopy("**/*.js");
     // add custom Liquid filter named "safe"
    eleventyConfig.addFilter("safe", function(content){
        return content; 
    });
    
    return eleventyConfig;
   
  };