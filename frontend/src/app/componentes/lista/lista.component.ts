import { Component, OnInit } from '@angular/core';
import { LivroService } from 'src/app/servicos/livro.service';
import { Livro } from 'src/app/Livro';
import { Router } from '@angular/router';

@Component({
  selector: 'app-lista',
  templateUrl: './lista.component.html',
  styleUrls: ['./lista.component.sass'],
})
export class ListaComponent implements OnInit {
  livros: Livro[];
  isModal: boolean = false;
  idProcurado!: any;
  idLivroParaExcluir!: any;

  constructor(private service: LivroService, private router: Router) {
    this.livros = [];
  }

  ngOnInit(): void {
    this.listarLivros();
  }

  listarLivros() {
    this.service.listar().subscribe((resultado) => {
      console.log(resultado);
      this.livros = resultado;
    });
  }

  confirmarAcao() {
    this.service.deleteLivro(this.idLivroParaExcluir).subscribe({
      next: (resultado) => {
        console.log('Livro excluído com sucesso');
        this.listarLivros();
      },
      error: (erro) => console.error(erro),
      complete: () => {
        console.info('Processo de exclusão completado');
        this.isModal = false;
      },
    });
  }

  cancelarAcao() {
    this.isModal = false;
  }

  mostrarModal(id: any) {
    this.isModal = true;
    this.idLivroParaExcluir = id;
  }

  editar(id: any) {
    this.router.navigate(['editar/' + id]);
  }
}
