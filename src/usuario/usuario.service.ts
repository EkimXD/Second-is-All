import {Injectable} from "@nestjs/common";
import {InjectRepository} from "@nestjs/typeorm";
import {DeleteResult, Repository} from "typeorm";
import {UsuarioEntity} from "./usuario.entity";

@Injectable()
export class UsuarioService {
    constructor(
        @InjectRepository(UsuarioEntity)
        private _repositorioUsuario: Repository<UsuarioEntity>
    ) {}

    encontrarUno(id_usuario: number): Promise<UsuarioEntity | undefined> {
        return this._repositorioUsuario
            .findOne(id_usuario);
    }

    encontrarRoles(id_usuario: number): Promise<UsuarioEntity | undefined> {
        return this._repositorioUsuario
            .findOne(id_usuario);
    }

    crearUno(usuario: UsuarioEntity) {
        return this._repositorioUsuario
            .save(usuario);
    }

    borrarUno(id: number): Promise<DeleteResult> {
        return this._repositorioUsuario
            .delete(id);
    }

    actualizarUno(
        id: number,
        usuario: UsuarioEntity
    ): Promise<UsuarioEntity> {
        usuario.id_usuario = id;
        return this._repositorioUsuario
            .save(usuario); // UPSERT
    }

    buscar(
        where: any = {},
        relations:any=[],
        skip: number = 0,
        take: number = 10,
        order: any = {
            id_usuario: 'DESC',
            nombre: 'ASC'
        }
    ): Promise<UsuarioEntity[]> {
        return this._repositorioUsuario
            .find({
                where: where,
                skip: skip,
                take: take,
                order: order,
                relations:relations
            });
    }
}
