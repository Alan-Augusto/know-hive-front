import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { BaseApiService } from '../base-api.service';
import { ICollectionStats, ICreateQuestionResponse, IGetResponsesQuery, IGetUserStats, IQuestionResponseFull, IQuestionStats, IUpdateQuestionResponse, IUserStats } from '../../entity/questionResponse.interface';

@Injectable({
  providedIn: 'root'
})
export class QuestionResponseService extends BaseApiService {

  override entityUrl = '/question-responses';

  /**
   * Criar uma nova resposta
   * Registra uma nova resposta de um usuário a uma questão
   */
  create(data: ICreateQuestionResponse): Observable<IQuestionResponseFull> {
    return this.post('', data);
  }

  /**
   * Listar todas as respostas com filtros opcionais
   */
  findAll(query?: IGetResponsesQuery): Observable<IQuestionResponseFull[]> {
    let params = new HttpParams();

    if (query?.user_id) {
      params = params.set('user_id', query.user_id);
    }
    if (query?.question_id) {
      params = params.set('question_id', query.question_id);
    }
    if (query?.collection_id) {
      params = params.set('collection_id', query.collection_id);
    }

    return this.get('', params);
  }

  /**
   * Buscar uma resposta específica pelo ID
   */
  findOne(id: string): Observable<IQuestionResponseFull> {
    return this.get(id);
  }

  /**
   * Listar todas as respostas de um usuário específico
   */
  findByUser(userId: string): Observable<IQuestionResponseFull[]> {
    return this.get(`user/${userId}`);
  }

  /**
   * Listar todas as respostas de uma questão específica
   */
  findByQuestion(questionId: string): Observable<IQuestionResponseFull[]> {
    return this.get(`question/${questionId}`);
  }

  /**
   * Listar todas as respostas de uma coleção específica
   */
  findByCollection(collectionId: string): Observable<IQuestionResponseFull[]> {
    return this.get(`collection/${collectionId}`);
  }

  /**
   * Obter estatísticas de desempenho de um usuário
   */
  getUserStats(userId: string, query?: IGetUserStats): Observable<IUserStats> {
    let params = new HttpParams();

    if (query?.collection_id) {
      params = params.set('collection_id', query.collection_id);
    }

    return this.get(`stats/user/${userId}`, params);
  }

  /**
   * Obter estatísticas de uma questão específica
   */
  getQuestionStats(questionId: string): Observable<IQuestionStats> {
    return this.get(`stats/question/${questionId}`);
  }

  /**
   * Obter estatísticas de uma coleção específica
   */
  getCollectionStats(collectionId: string): Observable<ICollectionStats> {
    return this.get(`stats/collection/${collectionId}`);
  }

  /**
   * Atualizar uma resposta existente
   */
  update(id: string, data: IUpdateQuestionResponse): Observable<IQuestionResponseFull> {
    return this.patch(id, data);
  }

  /**
   * Remover uma resposta específica
   */
  remove(id: string): Observable<{ message: string }> {
    return this.delete(id);
  }
}
