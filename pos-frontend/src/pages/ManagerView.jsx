import {getEmployee, getMenu} from '../fetchData.js';

export default  function ManagerView() {
  console.log( getEmployee());

  return <h1>Manager view (Placeholder)</h1>;
}
