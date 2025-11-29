/**
 * @jest-environment jest-environment-jsdom
 */
import '@testing-library/jest-dom';
import { render } from '@testing-library/react';
import { Dashboard } from '../../src/screens/Dashboard';


const mockNavigate = jest.fn();

jest.mock('react-router', () => ({

    ...jest.requireActual('react-router'),
    useNavigate: () => mockNavigate,
}));

describe('screens/Dashboard', () => {


    beforeEach(() => {
        mockNavigate.mockClear();
    });

    it('should redirect to /posts immediately upon mounting', () => {
        render(<Dashboard />);


        expect(mockNavigate).toHaveBeenCalledTimes(1);


        expect(mockNavigate).toHaveBeenCalledWith('/posts', {
            replace: true
        });
    });
});