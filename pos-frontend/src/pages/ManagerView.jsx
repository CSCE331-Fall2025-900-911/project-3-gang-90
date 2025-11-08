import {getEmployee, getMenu} from '../fetchData.js';

export default async function ManagerView() {
  console.log(await getEmployee());

  return <h1>Manager view (Placeholder)</h1>;
}
