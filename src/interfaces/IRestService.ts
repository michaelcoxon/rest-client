import { HttpMethod } from '../interfaces/HttpClientEnums';
import { ConstructorFor } from '@michaelcoxon/utilities';


export interface ICreatable<TEntity>
{
    createAsync(entity: TEntity): Promise<TEntity>;
}

export interface IReadable<TEntity, TQueryParameters>
{
    getAsync(query: TQueryParameters): Promise<TEntity>;
}

export interface IListable<TEntity, TQueryParameters>
{
    listAsync(query: TQueryParameters): Promise<TEntity[]>;
}

export interface IUpdatable<TEntity>
{
    updateAsync(entity: TEntity): Promise<TEntity>;
}

export interface IDeletable<TEntity>
{
    deleteAsync(entity: TEntity): Promise<TEntity>;
}

export interface IReadService<TEntity, TSingleQueryParameters, TListQueryParameters> extends IReadable<TEntity, TSingleQueryParameters>, IListable<TEntity, TListQueryParameters>
{

}

export interface IWriteService<TEntity> extends ICreatable<TEntity>, IUpdatable<TEntity>, IDeletable<TEntity>
{

}

export interface IRestService<TReadEntity, TSingleQueryParameters, TListQueryParameters, TWriteEntity = TReadEntity> extends IReadService<TReadEntity, TSingleQueryParameters, TListQueryParameters>, IWriteService<TWriteEntity>
{

}