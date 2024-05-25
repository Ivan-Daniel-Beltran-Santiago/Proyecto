import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterCalif',
})
export class FilterCalifPipe implements PipeTransform {
  transform(value: any, args: any): any {
    let resultPost = [];
    for (let post of value) {
      if (
        post.first_name_A.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        post.last_name_A.toLowerCase().indexOf(args.toLowerCase()) > -1
      ) {
        resultPost.push(post);
      }
    }
    return resultPost;
  }
}
