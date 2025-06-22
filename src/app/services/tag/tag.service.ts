import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from '../base-api.service';

@Injectable({
  providedIn: 'root'
})
export class TagService extends BaseApiService {

  override entityUrl = '/tag';

  // Criar uma nova tag
  create(createTagDto: any): Observable<any> {
    return this.post('', createTagDto);
  }

  // Buscar todas as tags
  findAll(): Observable<any> {
    return this.get('');
  }

  // Buscar tags por nome
  searchByName(name: string): Observable<any> {
    const params = new HttpParams().set('name', name);
    return this.get('search', params);
  }

  // Buscar tag por ID
  findOne(id: string): Observable<any> {
    return this.get(id);
  }

  // Buscar coleções por tag
  getCollectionsByTag(id: string): Observable<any> {
    return this.get(`${id}/collections`);
  }

  // Buscar questões por tag
  getQuestionsByTag(id: string): Observable<any> {
    return this.get(`${id}/questions`);
  }

  // Atualizar tag
  update(id: string, updateTagDto: any): Observable<any> {
    return this.patch(id, updateTagDto);
  }

  // Remover tag
  remove(id: string): Observable<any> {
    return this.delete(id);
  }

  // Métodos para gerenciar tags em coleções

  // Atribuir tags a uma coleção
  assignTagsToCollection(collectionId: string, tagIds: string[]): Observable<any> {
    return this.post(`collections/${collectionId}/assign`, { tagIds });
  }

  // Buscar tags de uma coleção
  getCollectionTags(collectionId: string): Observable<any> {
    return this.get(`collections/${collectionId}`);
  }

  // Remover tag de uma coleção
  removeTagFromCollection(collectionId: string, tagId: string): Observable<any> {
    return this.delete(`collections/${collectionId}/tags/${tagId}`);
  }

  // Métodos para gerenciar tags em questões

  // Atribuir tags a uma questão
  assignTagsToQuestion(questionId: string, tagIds: string[]): Observable<any> {
    return this.post(`questions/${questionId}/assign`, { tagIds });
  }

  // Buscar tags de uma questão
  getQuestionTags(questionId: string): Observable<any> {
    return this.get(`questions/${questionId}`);
  }

  // Remover tag de uma questão
  removeTagFromQuestion(questionId: string, tagId: string): Observable<any> {
    return this.delete(`questions/${questionId}/tags/${tagId}`);
  }
}
