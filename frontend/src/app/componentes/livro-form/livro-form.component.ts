import { Component, OnInit } from '@angular/core';
import { LivroService } from 'src/app/servicos/livro.service';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-livro-form',
  templateUrl: './livro-form.component.html',
  styleUrls: ['./livro-form.component.sass'],
})
export class LivroFormComponent implements OnInit {
  livro: any;
  form!: FormGroup;
  verificarStatus: boolean = true;
  isAlert: boolean = false;

  /*
  true - estamos utilizando o form para cadastro - aparecer botão Cadastrar
  false - estamos utilizando o form para edição - aparecer o botão Alterar
   */

  constructor(
    private fb: FormBuilder,
    private service: LivroService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.form = this.fb.group({
      id: [null],
      nome: [null],
      autor: [null],
      foto: [null],
    });

    const id_entrada = <any>this.route.snapshot.params['id'];
    console.log('id de entrada: ' + id_entrada);
    this.service.getUmLivro(id_entrada).subscribe({
      next: (resultado) => {
        console.log(resultado);
        this.livro = resultado;
        this.updateForm(this.livro);
        this.verificarStatus = false;
      },
      error: (erro) => console.error(erro),
      complete: () => console.info('Livro encontrado'),
    });
  }

  salvarLivro() {
    console.log(this.form.value);
    if (this.form.value.id) {
      /* nós vamos editar */
      this.service.editLivro(this.form.value.id, this.form.value).subscribe({
        next: (resultado) => console.log('Livro editado com sucesso'),
        error: (erro) => console.error(erro),
        complete: () => {
          console.info('Edição efetuada');
          this.router.navigate(['/lista']);
        },
      });
    } else {
      /* nós vamos cadastrar */
      this.service.addLivro(this.form.value).subscribe({
        next: (resultado) => console.log('Livro cadastrado com sucesso'),
        error: (erro) => console.error(erro),
        complete: () => {
          console.info('Cadastro efetuado');
          this.mostrarAlert();
        },
      });
    }
  }

  mostrarAlert() {
    this.isAlert = true;
  }

  updateForm(livro: any) {
    this.form.patchValue({
      id: livro.id,
      nome: livro.nome,
      autor: livro.autor,
      foto: livro.foto,
    });
  }
}
