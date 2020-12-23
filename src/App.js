import useFetchJobs from './utils/useFetchJobs';
import { Container } from 'react-bootstrap';
import { useState } from 'react';

const App = () => {
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);
  const { jobs, loading, error } = useFetchJobs(params, page);

  return (
    <Container>
      { loading && <h1>currently loading ∙ please wait</h1> }
      { error && <h1>error loading ∙ try refreshing</h1> }
      <h1>{ jobs.length }</h1>
    </Container>
  );
}

export default App;