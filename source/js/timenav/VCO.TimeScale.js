/*  VCO.TimeScale
    Strategies for laying out the timenav
    make a new one if the slides change

    TODOS: deal with clustering 
================================================== */
VCO.TimeScale = VCO.Class.extend({
    
    initialize: function (slides, pixelWidth) {
        if (pixelWidth == null) { pixelWidth = 0; }
        this.slides = slides;

        this.earliest = slides[0].date.data.date_obj.getTime();
        this.latest = slides[slides.length - 1].date.data.date_obj.getTime();
        this.spanInMillis = this.latest - this.earliest;
        this.average = (this.spanInMillis)/this.slides.length;

        this.setPixelWidth(pixelWidth);
    },
    
    setPixelWidth: function(width) {
        this.pixelWidth = width;
        this.pixelsPerMilli = this.pixelWidth / this.spanInMillis;
    },

    getPosition: function(timeInMillis) {
        return ( timeInMillis - this.earliest ) * this.pixelsPerMilli
    }
    
});
