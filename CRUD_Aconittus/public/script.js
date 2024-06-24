document.addEventListener('DOMContentLoaded', function () {
  const form = document.getElementById('form');
  const pessoasTable = document.getElementById('pessoasTable');

  form.addEventListener('submit', async function (event) {
    event.preventDefault();

    const nome = document.getElementById('nome').value;
    const rua = document.getElementById('rua').value;
    const numero = document.getElementById('numero').value;
    const bairro = document.getElementById('bairro').value;
    const cidade = document.getElementById('cidade').value;

    try {
      const response = await fetch('/api/pessoas', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ nome, rua, numero, bairro, cidade }),
      });

      if (!response.ok) {
        throw new Error('Erro ao cadastrar pessoa');
      }

      const pessoa = await response.json();
      console.log('Pessoa cadastrada:', pessoa);

      // Limpar o formulário após o cadastro
      form.reset();

      // Atualizar a tabela de pessoas cadastradas
      carregarPessoas();

    } catch (error) {
      console.error('Erro ao cadastrar pessoa:', error);
    }
  });


  carregarPessoas();
});

function editarPessoa(id) {
  const nome = document.getElementById('nome').value;
  const rua = document.getElementById('rua').value;
  const numero = document.getElementById('numero').value;
  const bairro = document.getElementById('bairro').value;
  const cidade = document.getElementById('cidade').value;
  fetch(`/api/pessoas/${id}`, {
    headers: {
      'Content-Type': 'application/json',
    },
    method: 'PUT',
    body: JSON.stringify({ id, nome, rua, numero, bairro, cidade })

  })
    .then(response => {
      if (!response.ok) {
        throw new Error('Erro ao carregar pessoa para edição');
      }
      return response.json();
    })
    .then(response => {
      document.getElementById('btnCadastrar').style = 'display: block';
      document.getElementById('btnEditar').style = 'display: none';
      document.getElementById('nome').value = '';
      document.getElementById('rua').value = '';
      document.getElementById('numero').value = '';
      document.getElementById('bairro').value = '';
      document.getElementById('cidade').value = '';
      carregarPessoas();
    })
    .catch(error => console.error('Erro ao carregar pessoa para edição:', error));
}


function deletarPessoa(id) {
  fetch(`/api/pessoas/${id}`, {
    method: 'DELETE',
  })
    .then(() => {
      console.log('Pessoa deletada com sucesso');
      carregarPessoas();
    })
    .catch(error => console.error('Erro ao deletar pessoa:', error));
}

function getPessoa(id) {
  fetch('/api/pessoas')
    .then(response => response.json())
    .then(pessoas => {
      const pessoa = pessoas.filter(pessoa => pessoa.id == id)[0]
      if (!pessoa) {
        throw new Error('Pessoa não localizada')
      }
      document.getElementById('nome').value = pessoa.nome;
      document.getElementById('rua').value = pessoa.rua;
      document.getElementById('numero').value = pessoa.numero;
      document.getElementById('bairro').value = pessoa.bairro;
      document.getElementById('cidade').value = pessoa.cidade;
      document.getElementById('btnCadastrar').style = 'display: none';
      document.getElementById('btnEditar').style = 'display: block';
      document.getElementById('btnEditar').replaceWith(document.getElementById('btnEditar').cloneNode(true))
      document.getElementById('btnEditar').addEventListener('click', () => editarPessoa(pessoa.id))
    })
    .catch(error => console.error('Erro ao carregar pessoas:', error));
}


function carregarPessoas() {
  fetch('/api/pessoas')
    .then(response => response.json())
    .then(pessoas => {
      pessoasTable.innerHTML = ''; // Limpar a tabela antes de atualizar
      const headers = document.createElement('tr')
      headers.innerHTML = `
        <th>ID</th>
        <th>Nome</th>
        <th>Rua</th>
        <th>Número</th>
        <th>Bairro</th>
        <th>Cidade</th>
        <th>Ações</th>
      `
      pessoasTable.appendChild(headers)

      pessoas.forEach(pessoa => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${pessoa.id}</td>
            <td>${pessoa.nome}</td>
            <td>${pessoa.rua}</td>
            <td>${pessoa.numero}</td>
            <td>${pessoa.bairro}</td>
            <td>${pessoa.cidade}</td>
            <td>
              <button onclick="getPessoa(${pessoa.id})">Editar</button>
              <button onclick="deletarPessoa(${pessoa.id})">Deletar</button>
            </td>
          `;
        pessoasTable.appendChild(row);
      });
    })
    .catch(error => console.error('Erro ao carregar pessoas:', error));
}