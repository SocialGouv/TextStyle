import { useMutation } from '@apollo/react-hooks';
import { gql } from "apollo-boost";

const ADD_PROJECT = gql`
mutation AddProject($name: String!, $description: String!) {
    insert_project(objects: {description: $description, name: $name}) {
      affected_rows
      returning {
        name
        id
        description
      }
    }
  }  
`;

export default function AddProject() {
  let inputName;
  let inputDescription;
  const [addProject, { data }] = useMutation(ADD_PROJECT);

  return (
    <div>
      <form
        onSubmit={e => {
          e.preventDefault();
          addProject({ variables: { name: inputName.value, description: inputDescription.value } });
          inputName.value = '';
          inputDescription.value = '';
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