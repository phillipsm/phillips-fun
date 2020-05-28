const keep_moving_sketch = ( sketch ) => {

    // Store our sketch dimensions and dom element here in case
    // we need to resize
    let sketch_width, sketch_height, canvas_container_element;
    let x, y, color_a, color_b;
    let available_colors = [ 'f7e8f6', 'f7e8f6', 'e5b0ea', 'bd83ce' ];

    sketch.preload = () => {

        canvas_container_element = document.getElementById('canvas-container-a');

    };

    sketch.setup = () => {

        sketch.setDimensions();

        // Remove our placeholder image after we've loaded the dom
        // and are ready to draw. Then, create our cavnas
        placeholder_img = document.querySelector('#canvas-container-a img');
        if ( placeholder_img ) {
            placeholder_img.remove();
        }

        x = 0;
        y = sketch.random( sketch_height * .2, sketch_height * .3 );
        sketch.get_next_colors();

        sketch.createCanvas(sketch_width, sketch_height);
        sketch.frameRate(80);

    };

    sketch.draw = () => {

        if ( x <= sketch_width ) {

            let inter = sketch.map( x, 0, sketch_width, 0, 1 );
            let color = sketch.lerpColor( color_a, color_b, inter );
            sketch.stroke( color );
            sketch.fill( color );

            sketch.ellipse( x, y, sketch_height * .012, sketch_height * .012 );
            x += sketch_height * .003;
            y = sketch.random( y - sketch_height * .007, y + sketch_height * .007 );

            if ( y >= sketch_height ) {
                y = sketch_height;
            }

            if ( y <= 0 ) {
                y = 0;
            }

        } else {

            x = 0;
            y = sketch.random( 0, sketch_height );
            sketch.get_next_colors();

        }

    }

    sketch.get_next_colors = () => {

        if ( !color_a ) {
            color_a = sketch.color( '#' + sketch.random( available_colors ) );
        } else {
            color_a = color_b;
        }

        color_b = sketch.color( '#' + sketch.random( available_colors ) );

    }

    sketch.windowResized = () => {

        // Kludge: ios seems to fire resize() during scrolling
        if ( sketch_width !== canvas_container_element.clientWidth ) {
            sketch.setDimensions();
            sketch.resizeCanvas( sketch_width, sketch_height );
            x = 0;
            y = sketch.random( sketch_height * .2, sketch_height * .3 );
            sketch.clear();
        }

    }

    sketch.setDimensions = () => {

        // We use this to help with resizing and fullscreen displays
        // Calculate the width and height of our canvas here
        // Lets keep a 3:2 aspect ratio if we're not in fullscreen
        sketch_width = canvas_container_element.clientWidth;

        if ( document.getElementById('controls' ) ) {
            sketch_height = window.innerHeight;
        } else {
            sketch_height = sketch_width * (2/3);
        }
    }

};

new p5(keep_moving_sketch, 'canvas-container-a');

// If our fullscren button is clicked, we toggle fullscreen mode
document.addEventListener('click', function (event) {

	// Thanks, https://github.com/neovov/Fullscreen-API-Polyfill
	if ( !event.target.hasAttribute( 'data-toggle-fullscreen' ) ) return;

    // Toggle fullscreen
    if ( document.fullscreenElement ) {
    	document.exitFullscreen();
    } else {
        let elem = document.querySelector("body");
    	elem.requestFullscreen();
    }

    // Hide the cursor and fullscreen button
    // ever 3 seconds if we're in fullscreen mode
    window.setInterval( hide_controls, 3000 );

}, false);

// When we toggle fullscreen mode, we hide the cursor
// and the fullscreen button. If we detect a mousemove,
// we show our cursor and button
document.addEventListener('mousemove', e => {

    if ( document.fullscreenElement ) {
        var canvas_element = document.querySelector('body');
        canvas_element.style.cursor = 'auto';

        var controls_element = document.getElementById('controls');
        controls_element.style.display = 'block';
    }

});

// Our logic to hide the cursor and fullscreen button
function hide_controls() {

    if ( document.fullscreenElement ) {
        var canvas_element = document.querySelector('body');
        canvas_element.style.cursor = 'none';

        var controls_element = document.querySelector('#controls');
        controls_element.style.display = 'none';
    }

}
