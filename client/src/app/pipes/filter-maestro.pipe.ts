import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterMaestro',
})
export class FilterMaestroPipe implements PipeTransform {
  transform(value: any, args: any): any {
    let resultPost = [];
    for (let post of value) {
      if (
        post.first_name_M.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        post.last_name_M.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        post.telephone_M.indexOf(args) > -1
      ) {
        resultPost.push(post);
      }
    }
    return resultPost;
  }
}
