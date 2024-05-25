import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'filterAdmin',
})
export class FilterAdminPipe implements PipeTransform {
  transform(value: any, args: any): any {
    let resultPost = [];
    for (let post of value) {
      if (
        post.first_name_AD.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        post.last_name_AD.toLowerCase().indexOf(args.toLowerCase()) > -1 ||
        post.telephone_AD.toLowerCase().indexOf(args.toLowerCase()) > -1
      ) {
        resultPost.push(post);
      }
    }
    return resultPost;
  }
}
