import { useMutation } from '@apollo/react-hooks';
import Router from 'next/router';
import { ADD_PROJECT } from './queries'

export default function AddProject() {
  let inputName;
  let inputDescription;
  const [addProject] = useMutation(ADD_PROJECT);

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addProject({ variables: { name: inputName.value, description: inputDescription.value } });
          inputName.value = '';
          inputDescription.value = '';
          Router.push({ pathname: '/' })
        }}
      >
        <div class="form-group">
          <p>Nom du projet</p>
          <input
            ref={node => {
              inputName = node;
            }}
            className="form-control"
          />
        </div>
        <div class="form-group">
          <p>Description du projet</p>

          <textarea
            ref={node => {
              inputDescription = node;
            }}
            className="form-control"
          />
        </div>

        <button type="submit">Ajouter le projet</button>
      </form>
    </div>
  );
}