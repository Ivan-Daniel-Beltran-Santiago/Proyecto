import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filter',
})
export class FilterPipe implements PipeTransform {
  transform(value: any, args: any): any {
    if (!Array.isArray(value)) {
      return value;
    }

    let resultPost = [];
    for (let post of value) {
      if (
        post.first_nameU.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        post.last_nameU.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        post.telephoneU.indexOf(args) > -1 ||
        post.status.toLowerCase().indexOf(args.toLowerCase()) > -1
      ) {
        resultPost.push(post);
      }
    }
    return resultPost;
  }
}
