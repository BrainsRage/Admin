import {RouteInfo} from './sidebar.metadata';

export const ROUTES: RouteInfo[] = [
  {path: '/dashboard', title: 'Главная', icon: 'material-icons'},
  {path: '/news/index', title: 'Список', icon: 'material-icons'},
  {path: '/news/add', title: 'Добавить', icon: 'material-icons'},
  {path: '/articles/index', title: 'Список', icon: 'material-icons'},
  {path: '/articles/add', title: 'Добавить', icon: 'material-icons'},
  {path: '/articles/cats', title: 'Категории', icon: 'material-icons'},
  {path: '/articles/cats/add', title: 'Добавить категорию', icon: 'material-icons'},
  {path: '/gallery/cats', title: 'Категории', icon: 'material-icons'},
  {path: '/gallery/cats/add', title: 'Добавить категорию', icon: 'material-icons'},
];
