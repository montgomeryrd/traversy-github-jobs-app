import useFetchJobs from './utils/useFetchJobs';
import { Container } from 'react-bootstrap';
import { useState } from 'react';

import Job from './components/Jobs';
import JobsPagination from './components/JobsPagination';
import SearchForm from './components/SearchForm';

const App = () => {
  const [params, setParams] = useState({});
  const [page, setPage] = useState(1);
  const { jobs, loading, error, hasNextPage } = useFetchJobs(params, page);

  function handleParamChange(e) {
    const param = e.target.name;
    const value = e.target.value;
    setPage(1);
    setParams(prevParams => {
      return { ...prevParams, [param]: value }
    })
  }

  return (
    <Container className="my-4">
      <h1>Github Jobs</h1>
      <SearchForm params={params} onParamChange={handleParamChange} />
      <JobsPagination page={page} setPage={setPage} hasNextPage={hasNextPage}/>
      { loading && <h1>loading...</h1> }
      { error && <h1>error loading ∙∙∙ try refreshing</h1> }
      { jobs.map(job => {
        return <Job key={job.id} job={job} />      
      })}
    </Container>
  );
}

export default App;