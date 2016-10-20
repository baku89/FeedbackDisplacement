import $ from 'jquery'
import 'jquery.transit'
import lerp from 'lerp'
import clamp from 'clamp'

import trackDragging from './track-dragging.js'

function mod(n, m) {
	return ((n % m) + m) % m
}


Vue.filter('precision', function(value) {
	return parseFloat(value).toFixed(2)
})

Vue.filter('degrees', function(value) {
	return `${(value * 180 / Math.PI).toFixed(1)}°`
})


//------------------------------------------------------------------
Vue.component('ctrl-dropdown', {
	template: `
		<div class='ctrl__component ctrl__dropdown'>
			<label>{{name}}</label>
			<select>
				<option v-for='option in options'>{{option}}</option>
			</select>
		</div>`,
	props: ['name'],
	data() {
		return {
			options: ['One', 'Two', 'Three']
		}
	}
})

//------------------------------------------------------------------
Vue.component('ctrl-range', {
	template: `
		<div class='ctrl__component ctrl__range'>
			<label>{{name}}</label>
			<div class='container'>
				<div class='fill' v-bind:style='{transform: fillTransform}'></div>
				<div class='value'>{{value | precision}}</div>
				<input type='range' v-bind:min='min' v-bind:max='max' v-model='value' v-bind:step='step' />
			</div>
		</div>`,
	data() {
		return {
			name: 'FREQUENCY',
			value: 0.2,
			min: 0,
			max: 2,
			step: 0.0001
		}
	},
	computed: {
		fillTransform: function() {
			return `scaleX(${this.value / (this.max - this.min)})`
		}
	}
})

//------------------------------------------------------------------
Vue.component('ctrl-offset', {
	template: `
		<div class='ctrl__component ctrl__offset'>
			<label>{{name}}</label>
			<div class='container' v-on:mousedown='onMousedown'>
				<div class='grid' v-bind:style='{transform: gridTranslate}'></div>
				<div class='zero' v-bind:style='{transform: zeroTranslate}'></div>
				<div class='value'>{{value | precision}}</div>
			</div>
		</div>`,
	data() {
		return {
			name: 'FLOAT',
			value: 1.0,
			width: 2.0
		}
	},
	computed: {
		gridTranslate() {
			let w = this.$el.offsetWidth
			let x = mod(w * (this.value / this.width), 40)
			return `translateX(${x}px)`
		},
		zeroTranslate() {
			let w = this.$el.offsetWidth
			let x = w * (this.value / this.width)
			return `translateX(${x}px)`
		}
	},
	methods: {
		onMousedown() {
			let step = this.width /  this.$el.offsetWidth
			trackDragging({reset: true}, (x) => {
				this.value += x * step
			})
		}
	}
})

//------------------------------------------------------------------
Vue.component('ctrl-angle', {
	template: `
		<div class='ctrl__component ctrl__angle'>
			<label>{{name}}</label>
			<div class='container'>
				<div class='knob' v-on:mousedown='onMousedown' v-bind:style='{transform: knobRotate}'>
					<div class='marker'></div>
				</div>
				<div class='value'>{{value | degrees}}</div>
			</div>
		</div>
		`,
	data() {
		return {
			name: 'ANGLE',
			value: 2
		}
	},
	computed: {
		knobRotate: function() {
			return `rotate(${-this.value / Math.PI * 180}deg )`
		}
	},
	methods: {
		onMousedown(e) {

			let rect = this.$el.getBoundingClientRect()
			let origin = {
				x: (rect.left + rect.right) / 2,
				y: (rect.top + rect.bottom) / 2
			}

			let initialAngle = -Math.atan2(e.pageY - origin.y, e.pageX - origin.x)
			let initialValue = this.value

			trackDragging({origin}, (x, y) => {
				let angle = -Math.atan2(y, x)
				this.value = (initialValue + (angle - initialAngle) + Math.PI * 2) % (Math.PI * 2)
			})
		}
	}
})

//------------------------------------------------------------------
Vue.component('ctrl-range2d', {
	template: `
		<div class='ctrl__component ctrl__range2d'>
			<label>{{name}}</label>
			<div class='value'>{{value.x | precision}}, {{value.y | precision}}</div>
			<div class='container' v-on:mousedown='onMousedown($event)'>
				<div class='pad'>
					<div class='dot' v-bind:style='{top: uiTop, left: uiLeft}'></div>
					<div class='axis-x' v-bind:style='{top: uiTop}'></div>
					<div class='axis-y' v-bind:style='{left: uiLeft}'></div>
				</div>
			</div>
		</div>
		`,
	data() {
		return {
			name: 'POSITION',
			value: {
				x: 0.5,
				y: 0.5
			}
		}
	},
	computed: {
		uiTop: function() {
			return `${this.value.y * 100}%`
		},
		uiLeft: function() {
			return `${this.value.x * 100}%`
		}
	},
	methods: {
		onMousedown(e) {

			let rect = e.target.getBoundingClientRect()
			let origin = {
				x: rect.left,
				y: rect.top
			}

			trackDragging({origin}, (x, y) => {
				this.value.x = clamp(x / rect.width, 0, 1)
				this.value.y = clamp(y / rect.height, 0, 1)
			})
		}
	}
})

//------------------------------------------------------------------
Vue.component('ctrl-offset2d', {
	template: `
		<div class='ctrl__component ctrl__offset2d'>
			<label>{{name}}</label>
			<div class='value'>{{value.x | precision}}, {{value.y | precision}}</div>
			<div class='container' v-on:mousedown='onMousedown($event)'>
				<div class='pad' v-bind:style='{transform: gridTranslate}'>
				</div>
				<div class='axis-x' v-bind:style='{transform: axisXTranslate}'></div>
				<div class='axis-y' v-bind:style='{transform: axisYTranslate}'></div>
			</div>
		</div>
		`,
	data() {
		return {
			name: 'OFFSET',
			value: {
				x: 0,
				y: 0
			}
		}
	},
	computed: {
		backgroundPosition() {
			return `${this.value.x * 100}% ${this.value.y * 100}%`
		},
		gridTranslate() {
			let $pad = this.$el.children[2]
			let x = mod(this.value.x * $pad.offsetWidth / 2, 40)
			let y = mod(this.value.y * $pad.offsetHeight / 2, 40)
			return `translate(${x}px, ${y}px)`
		},
		axisXTranslate() {
			let $pad = this.$el.children[2]
			let y = this.value.y * $pad.offsetHeight / 2
			return `translateY(${y}px)`
		},
		axisYTranslate() {
			let $pad = this.$el.children[2]
			let y = this.value.x * $pad.offsetWidth / 2
			return `translateX(${y}px)`
		}
	},
	methods: {
		onMousedown(e) {

			let stepX = 1 / this.$el.children[2].offsetWidth * 2
			let stepY = 1 / this.$el.children[2].offsetHeight * 2

			trackDragging({reset: true}, (x, y) => {
				this.value.x += x * stepX
				this.value.y += y * stepY
			})
		}
	}
})
