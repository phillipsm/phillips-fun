const bars = ( sketch ) => {

  let rectangles = [];
  let shimmering_rects = [];
  let intervals = new Set();

  let color_a = '#4FB477';
  let color_b = '#FFC4EB';
  let color_shimmer = '#ffd700';
  let color_shimmer_transition = '#ffec88';

  let sketch_width, sketch_height, vertical_slice_width, vertical_slices_total;

  sketch.setup = () => {
      sketch.setDimensions();
      sketch.createCanvas(sketch_width, sketch_height);
      // 68 vertical slices = 21 * 2 wide for our bars + 20 margins between bars + 3 left margin + 3 right margin
      vertical_slices_total = 68;
      vertical_slice_width = sketch_width/vertical_slices_total;
  };

  sketch.draw = () => {
    sketch.draw_grid();

    let interval = window.setInterval(function() {
		sketch.shimmer(sketch.get_rand_int(0, rectangles.length));},
		sketch.random(2000, 4000)
	);

    intervals.add(interval);
    interval = window.setInterval(sketch.remove_shimmer, sketch.random(2000, 4000));
    intervals.add(interval);

    sketch.noLoop();
  };


  sketch.get_rand_int = (min, max) => {
  	// A helper function that returns an integer between
  	// min and max

  	return Math.floor(Math.random() * (max - min) + min);
  }

  sketch.draw_grid = () => {

      // Below is logic to build the coordinates for rectangles.
      //rectangles.push({'id': sketch.get_rand_int(0, 1000000), 'next_x': next_x,
    //                     'next_y': next_y, 'w': 20, 'h': next_height,
    //                     'fill_color': current_color});


    let x = 0
    let color_counter = 0
    let fill_color = "#ffffff";
    let type_drawing = 'bar';


    // loop through and draw two slices for bars and one slice
    let vertical_slices_to_draw = 63;
    let bar_index = 3;

    while ( bar_index <= vertical_slices_to_draw ) {

        let padding_top_bottom = sketch.random(30, 70);
        let y = padding_top_bottom *2;
        let fill_color = color_a;

        if ( Math.random() >= 0.5 ) {
            fill_color = color_b;
        }

        while ( y < sketch_height - padding_top_bottom * 3 ) {
            let box_height = sketch.random(45, 70);
            rectangles.push({'id': sketch.random(0, 10000), 'x': bar_index * vertical_slice_width,
                             'y': y, 'w': vertical_slice_width * 2 , 'h': box_height,
                            'fill_color': fill_color});


            // toggle our fill colors
            if (fill_color === color_a) {
                fill_color = color_b;
            } else {
                fill_color = color_a;
            }

            y += box_height + 1;

        }

        bar_index += 3;

    }



      	// Draw all of our rectangles
      	for (let i=0, len=rectangles.length; i < len; i++) {
      		sketch.fill(rectangles[i].fill_color);
      		sketch.stroke(rectangles[i].fill_color)
      		sketch.rect(rectangles[i].x, rectangles[i].y, rectangles[i].w, rectangles[i].h);
      	}

  };




  sketch.shimmer = (random_index) => {
  	// Turn the rectangle to a thrid color, but let it shimmer a little first

  	var random_rect = rectangles[random_index];

  	if ( shimmering_rects.indexOf(random_rect.id) === -1 ) {

  		shimmering_rects.push(random_rect.id);

  		// Flicker at least once

  		// And flicker up to two more times
  		var flicker_times = sketch.get_rand_int(0, 3);

  		if (flicker_times == 0) {

  			sketch.set_shimmer_callback(color_shimmer, random_index, 0, 0);

  		} else if (flicker_times == 1) {

  			sketch.set_shimmer_callback(color_shimmer_transition, random_index, 0, 0);
  			sketch.set_shimmer_callback(color_shimmer, random_index, 30, 70);

  		} else if (flicker_times == 2) {
  			sketch.set_shimmer_callback(color_shimmer_transition, random_index, 0, 0);
  			sketch.set_shimmer_callback(color_shimmer, random_index, 30, 70);

  			sketch.set_shimmer_callback(color_shimmer_transition, random_index, 70, 110);
  			sketch.set_shimmer_callback(color_shimmer, random_index, 110, 140);

  		} else if (flicker_times == 3) {

  			sketch.set_shimmer_callback(color_shimmer_transition, random_index, 0, 0);
  			sketch.set_shimmer_callback(color_shimmer, random_index, 30, 70);
  			sketch.set_shimmer_callback(color_shimmer_transition, random_index, 70, 110);
  			sketch.set_shimmer_callback(color_shimmer, random_index, 110, 140);
  			sketch.set_shimmer_callback(color_shimmer_transition, random_index, 240, 280);
  			sketch.set_shimmer_callback(color_shimmer, random_index, 340, 380);
  			sketch.set_shimmer_callback(color_shimmer_transition, random_index, 380, 420);
  			sketch.set_shimmer_callback(color_shimmer, random_index, 480, 600);

  		}
  	}
  }

  sketch.set_shimmer_callback = (fill_color, index, duration_min, duration_max) => {
  	// A little helper to aid us set the man callbacks we use
  	// in the shimmer effect

  	window.setTimeout(function() {
  			sketch.fill(fill_color);
  			sketch.stroke(fill_color);
  			sketch.rect(rectangles[index].x, rectangles[index].y,
  				 rectangles[index].w, rectangles[index].h);
  		}, sketch.get_rand_int(duration_min, duration_max)
  	);
  }

  sketch.remove_shimmer = (fill_color, index, duration_min, duration_max) => {
    	// Once we get to 10% shimmering, let's remove some

    	if (shimmering_rects.length > .1 * rectangles.length) {
    		var random_shimmering_rect_index = sketch.get_rand_int(0, shimmering_rects.length);

    		for (var i=0, len=rectangles.length; i < len; i++) {

    			if (rectangles[i].id === shimmering_rects[random_shimmering_rect_index]) {
    				sketch.fill(rectangles[i].fill_color);
    				sketch.stroke(rectangles[i].fill_color);

    				sketch.rect(rectangles[i].x, rectangles[i].y,
    					 rectangles[i].w, rectangles[i].h);
    			}

    		}
    		delete shimmering_rects[random_shimmering_rect_index];
    	}
    }

    sketch.windowResized = () => {
        for (var id of intervals) {
            intervals.delete(id);
        }

        shimmering_rects.length = 0;
        rectangles.length = 0;

        sketch.setDimensions();
        sketch.resizeCanvas(sketch_width, sketch_height);
    }

    sketch.setDimensions = () => {

        // We use this js file in our services page and as a fullscreen
        // Calculate the width and height of our canvas here
        sketch_width = document.getElementById('canvas-container-b').clientWidth;
        if ( document.getElementsByClassName('services-page')[0] ) {
            sketch_height = sketch_width * (2/3);
        } else {
            sketch_height = window.innerHeight;
        }
    }

};

let myp5 = new p5(bars, 'canvas-container-b');
