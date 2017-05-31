import {Pipe, PipeTransform } from '@angular/core'

@Pipe({ name: 'objToArray' })
export class KeysPipe implements PipeTransform {
	transform(value: any, args: any[] = null): any {
		let keys = [];
		for (let key in value) {
			if(value[key].active)
				keys.push({name: key, id: value[key]});
		}
		return keys;
	}
}