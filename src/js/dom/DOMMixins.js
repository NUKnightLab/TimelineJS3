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
        const ani = {
            duration: this.options.duration,
            easing: this.options.ease
        };

        // Use Object.entries for cleaner iteration
        for (const [name, value] of Object.entries(pos)) {
            ani[name] = `${value}px`;
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
        const targetElement = el || this._el.container;

        // Use Object.entries for cleaner iteration
        for (const [name, value] of Object.entries(pos)) {
            targetElement.style[name] = `${value}px`;
        }
    }

    getPosition() {
        return getPosition(this._el.container);
    }
}
