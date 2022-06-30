## Orbits Engine


# Entity
```javascript
	import Entity from "@orbits/generator"

	class Sea extends Entity {

		// Required for each entity type
		get defaultProps() {
			return {
				depth: 100,
				size: 10000,
			};
		}

		// There is default toString method, but it
		// depends on Array.sort, so it will
		// be ~4 times slower than implemented
		// this way. Also, we recommend you to include $seed
		// as the library will work better when high level of
		// uniqueness is provided
		toString(){
			return [
				`$seed: ${this.seed}`,
				`depth: ${this.attributes.depth}`,
				`size: ${this.attributes.size}`,
			].join("\n");
		}
	}

	const sea = new Sea( secret, {
		depth: 100,
		size: 10000,
	});

```

# Sequence

Sequence object is designed to represent endless hex hash string. If you keep the input same input and apply same operations in same
order, you will always get same outputs.


Input is entity object and more specific - the string, produced from entity.toString() and given namespace


```javascript
	const sequence = sea.createSequence("islands");
```

sequence.next(n)
```javascript
	// Pull number from pool
	const num1 = sequence.next(3); // -> 2238
	const num2 = sequence.next(5); // -> 1005821

	// function argument of next means how many symbols from hex 
	// string will be used to generate the number

	// num1:
	// 8bef58fd0f328b361501557ed08ea2e6
	// ^^^                                - 2238 (from 0 to 4095)
	
	// num2:
	// 8bef58fd0f328b361501557ed08ea2e6
	//    ^^^^^                           - 1005821 (from 0 to 1048575)
```


sequence.row(length, digits)
```javascript
	const row1 = sequence.row(6, 4); // -> [ 3890, 35638, 5377, 21886, 53390, 41702 ]
	// Array of 6 numbers, each produced from 4 hex symbols (0 - 65535)

	const row2 = sequence.row(3, 5); // -> [ 107789, 848177, 488437 ]
	// Array of 3 numbers, each produced from 5 hex symbols (0 - 1005821)
```

sequence.range(min, max)
```javascript
	const r1 = sequence.range(0, 100);  // 90
	const r2 = sequence.range(-50, 50); // -30
```

sequence.rangeRow(length, min, max)
```javascript
	const rr1 = sequence.rangeRow(5, 0, 100);  // [ 81, 0, 41, 15, 57 ]
	const rr2 = sequence.rangeRow(7, -50, 50); // [-20, -15, -26, 9, -18, -48, -11 ]
```


sequence.match(options)
```javascript
	sequence.match({
		10:  "Type 1",
		30:  "Type 2",
		130: "Type 3",
	}); // -> "Type 3"
```

sequence.matchRow(length, options)
```javascript
	sequence.matchRow(19, {
		10:  "Type_1",
		30:  "Type_2",
		130: "Type_3",
	});
	// [
	//   'Type_3', 'Type_3', 'Type_3',
	//   'Type_3', 'Type_1', 'Type_1',
	//   'Type_3', 'Type_2', 'Type_2',
	//   'Type_3', 'Type_3', 'Type_3',
	//   'Type_3', 'Type_3', 'Type_2',
	//   'Type_3', 'Type_3', 'Type_1',
	//   'Type_3'
	// ]
```




# Grid
```javascript
	const grid = sea.createGrid({
		bounds: {
			x: [-100, 100],
			y: [-100, 100]
			// Describe dimmensions of the grid
			// Any number and names can be used
			// Valid schema:
			// longitude: [ -180, 180 ],
			// latitude:  [ -90,  90  ],
			// height:    [ -11000, 9000 ],
			// But all grid queries should match dimmensions schema
		},

		// Optional: determines if some of dimmensions "wraps",
		// forming cylinder, torus surface or something else
		wrap:   ["x"],


		// Optional - helps for shaping the grid across it's volume
		gradient: [
			{
				axis:   ["x", "y"],
				origin: { x: 85, y: 85 },
				values: {
					// The key in this schema (gradient waypoints) represents
					// unit, which is ~1/100 of biggest dimmension size / 2
					// (100 - -100) / 2
					// and casted to nearest lower integer
					// Also, be carefull with the values as
					// they should be casted as integers in between waypoints
					0:  100,
					10: 90,
					40: 0
				}
			}
		]
	});
```


grid.in(point)
```javascript
	grid.in({x: 10, y: 10});   // -> true
	grid.in({x: 110, y: 110}); // -> false
```


grid.gradientValueAt(point)
```javascript
	grid.gradientValueAt({x: 60, y: 40}); // -> 21
```