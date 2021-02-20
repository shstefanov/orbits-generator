
class OrbitsGenerator {
	
	constructor(options){
		if(typeof options === "undefined")   throw new Error("Argument 1 (options) is required");
		if(!options.hasOwnProperty("rules")) throw new Error("options.rules is required");
		options.validate && this.validateKinds(options.rules.kinds);
		this.classes = this.createClasses(options.rules);
	}

	validateKinds(kinds, rules){
		if(typeof kinds === "undefined") throw new Error("options.rules.kinds is required");
		const kind_names = Object.keys(kinds);
		if(kind_names.length === 0) throw new Error("Rules must contain at least 1 kind defined");
		
		// Validate that all kinds are objects
		for(let kind_name of kind_names){
			if(!kinds[kind_name] || typeof kinds[kind_name] !== "object" || Array.isArray(kinds[kind_name])){
				throw new Error(`${kind_name} kind definition should be object`);
			}
		}

		// Validate that root kind should be exactly 1
		if(kind_names.filter(kn => kinds[kn].root).length !== 1){
			throw new Error("There should be exactly 1 root kind");
		}

		// Validate childs presence
		for(let kn of kind_names){
			if(kinds[kn].hasOwnProperty("childs")){
				if(!Array.isArray(kinds[kn].childs)) throw new Error(`'childs' property of kind ${kn} should be array`);
				if(!kinds[kn].childs.every(c => typeof c === "string")) throw new Error(`All members of 'rules.kinds.${kn}.childs' should be strings`);
				for(let cn of kinds[kn].childs){
					if(!kinds.hasOwnProperty(cn)) throw new Error(`Child '${cn}' not found, required by 'rules.kinds.${kn}'`);
				}
			}
		}

		// Validate all kinds have 'pluralName' attribute
		for(let kn of kind_names){
			if(!kinds[kn].root){
				if(!kinds[kn].hasOwnProperty("pluralName"))
					throw new Error(`Missing required property 'pluralName' on 'kinds.${kn}'`);
				if(typeof kinds[kn].pluralName !== "string")
					throw new Error(`Property 'pluralName' of 'kinds.${kn}' should be string`);
				
			}
		}
	}

	createClasses(rules){
		class BaseClass {

		}

		const classes = {};

		for(let kind_name in rules.kinds){
			if( !/^[A-Z][a-zA-Z]*?$/.test(kind_name) ) 
				throw new Error(`Invalid kind name: '${kind_name}'`);

			const createClass = new Function("BaseClass", "kind_rules", `
				class ${kind_name} extends BaseClass {

					constructor(options){
						super()
					}

					get rules() { return kind_rules }
				}

				return ${kind_name};
			`);

			classes[kind_name] = createClass(BaseClass, rules.kinds[kind_name]);
		}




		return classes;
	}

}

module.exports = OrbitsGenerator;