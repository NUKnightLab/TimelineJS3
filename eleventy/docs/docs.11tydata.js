export default {
	permalink: function (data) {
        let foo = JSON.stringify(arguments)
        console.log('---- start here ----')
        console.log(arguments.length)
        console.log(Object.keys(arguments[0]))
        console.log('---- end here ----')
        foo = foo.substring(0,50)
		return `/docs/${this.slugify(data.page.fileSlug)}.html`;
	},
};