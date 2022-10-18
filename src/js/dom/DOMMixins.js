/*	
	DOM methods used regularly
	Assumes there is a _el.container and animator
================================================== */
import { getPosition } from "../dom/DOM"
import { Animate } from "../animation/Animate"

export class DOMMixins {
    /*	Adding, Hiding, Showing etc
	================================================== */
    show(animate) {
        if (animate) {
            /*
			this.animator = Animate(this._el.container, {
				left: 		-(this._el.container.offsetWidth * n) + "px",
				duration: 	this.options.duration,
				easing: 	this.options.ease
			});
			*/
        } else {
            this._el.container.style.display = "block";
        }
    }

    hide(animate) {
        this._el.container.style.display = "none";
    }

    addTo(container) {
        container.appendChild(this._el.container);
        this.onAdd();
    }

    removeFrom(container) {
        container.removeChild(this._el.container);
        this.onRemove();
    }

    /*	Animate to Position
	================================================== */
    animatePosition(pos, el) {
        var ani = {
            duration: this.options.duration,
            easing: this.options.ease
        };
        for (var name in pos) {
            if (pos.hasOwnProperty(name)) {
                ani[name] = pos[name] + "px";
            }
        }

        if (this.animator) {
            this.animator.stop();
        }
        this.animator = Animate(el, ani);
    }

    /*	Events
	================================================== */

    onLoaded() {
        this.fire("loaded", this.data);
    }

    onAdd() {
        this.fire("added", this.data);
    }

    onRemove() {
        this.fire("removed", this.data);
    }

    /*	Set the Position
	================================================== */
    setPosition(pos, el) {
        for (var name in pos) {
            if (pos.hasOwnProperty(name)) {
                if (el) {
                    el.style[name] = pos[name] + "px";
                } else {
                    this._el.container.style[name] = pos[name] + "px";
                }
            }
        }
    }

    getPosition() {
        return getPosition(this._el.container);
    }
}
