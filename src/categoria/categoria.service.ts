import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import {CategoriaEntity} from "./categoria.entity";


@Injectable()
export class CategoriaService {
    constructor(
        @InjectRepository(CategoriaEntity)
        private _repositorioCategoria: Repository<CategoriaEntity>
    ) {}

    encontrarUno(id: number): Promise<CategoriaEntity | undefined> {
        return this._repositorioCategoria
            .findOne(id);
    }

    crearUno(usuario: CategoriaEntity) {
        return this._repositorioCategoria
            .save(usuario);
    }

    borrarUno(id: number): Promise<DeleteResult> {
        return this._repositorioCategoria
            .delete(id);
    }

    actualizarUno(
        id: number,
        usuario: CategoriaEntity
    ): Promise<CategoriaEntity> {
        usuario.id = id;
        return this._repositorioCategoria
            .save(usuario); // UPSERT
    }

    buscar(
        where: any = {},
        skip: number = 0,
        take: number = 10,
        order: any = {
            id: 'DESC',
            nombre: 'ASC'
        }
    ): Promise<CategoriaEntity[]> {
        return this._repositorioCategoria
            .find({
                where: where,
                skip: skip,
                take: take,
                order: order,
            });
    }
}
