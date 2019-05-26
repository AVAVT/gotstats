import { configure as configureEnzyme } from 'enzyme';
import EnzymeReact16Adapter from 'enzyme-adapter-react-16';
import 'jest-enzyme';

configureEnzyme({ adapter: new EnzymeReact16Adapter() });