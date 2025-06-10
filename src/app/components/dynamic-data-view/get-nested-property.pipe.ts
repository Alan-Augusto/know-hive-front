import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'getNestedProperty',
  standalone: true,
})
export class GetNestedPropertyPipe implements PipeTransform {
  /**
   * Transforma um caminho de string (ex: 'a.b.c') no valor correspondente dentro de um objeto.
   * @param object O objeto base para pesquisar.
   * @param path O caminho da propriedade, usando notação de ponto.
   * @returns O valor encontrado ou null se o caminho for inválido.
   */
  transform(object: any, path: string | undefined): any {
    // Se o caminho não for fornecido ou o objeto for nulo, não há o que fazer.
    if (!path || object === null || object === undefined) {
      return null;
    }

    // Usa o método reduce para navegar pelo caminho.
    // Ex: 'author.name' se torna ['author', 'name']
    // O reduce itera sobre esse array, descendo um nível do objeto a cada passo.
    return path.split('.').reduce((o, key) => (o && o[key] !== undefined ? o[key] : null), object);
  }
}
