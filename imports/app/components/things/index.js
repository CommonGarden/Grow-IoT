import ImageComponent from './Images/ImageComponent';
import NewHub from './Device/Device.jsx';
import TodoList from './TodoList.jsx';
import Log from './Log.jsx';

// This is a hack to ease transition
// Delete once devices migrate over
const Device = NewHub;

const components = {
  Log,
  TodoList,
  ImageComponent,
  NewHub,
  Device
};

export default components;
