module global {
    declare module TL {
        /**
         * Enable/Disable debug logging
         */
        export var debug: boolean;

        /**
         * Helper to bind this parameter to a function
         * @param fn 
         * @param obj 
         * @return New function with obj bound as this
         */
        export function Bind(fn: Function, obj: Object): Function;

        export class TimelineConfig {

        }
      
        export type EaseFunction = (t: number) => number;
      
        export module Ease {
          export const KeySpline: EaseFunction;
          export const easeInSpline: EaseFunction;
          export const easeInOutExpo: EaseFunction;
          export const easeOut: EaseFunction;
          export const easeOutStrong: EaseFunction;
          export const easeIn: EaseFunction;
          export const easeInStrong: EaseFunction;
          export const easeOutBounce: EaseFunction;
          export const easeInBack: EaseFunction;
          export const easeOutBack: EaseFunction;
          export const bounce: EaseFunction;
          export const bouncePast: EaseFunction;
          export const swingTo: EaseFunction;
          export const swingFrom: EaseFunction;
          export const elastic: EaseFunction;
          export const spring: EaseFunction;
          export const blink: EaseFunction;
          export const pulse: EaseFunction;
          export const wobble: EaseFunction;
          export const sinusoidal: EaseFunction;
          export const flicker: EaseFunction;
          export const mirror: EaseFunction;
          export const easeInQuad: EaseFunction;
          export const easeOutQuad: EaseFunction;
          export const easeInOutQuad: EaseFunction;
          export const easeInCubic: EaseFunction;
          export const easeOutCubic: EaseFunction;
          export const easeInOutCubic: EaseFunction;
          export const easeInQuart: EaseFunction;
          export const easeOutQuart: EaseFunction;
          export const easeInOutQuart: EaseFunction;
          export const easeInQuint: EaseFunction;
          export const easeOutQuint: EaseFunction;
          export const easeInOutQuint: EaseFunction;
        }
      
        /**
         * Options for a Timeline element
         */
        export interface TimelineOptions {
          language?: string;
          timenav_position?: 'top' | 'bottom';
          ease?: EaseFunction;
          scale_factor?: number;
          marker_width_min?: number;
          optimal_tick_width?: number;
          timenav_height_percentage?: number;
          start_at_end?: boolean;
          duration?: number;
          zoom_sequence?: number[];
        }
      
        /**
         * A timeline element
         */
        export class Timeline {
          constructor(elem: string | HTMLElement, data: string | TimelineConfig, options?: TimelineOptions);
        }
    }
}