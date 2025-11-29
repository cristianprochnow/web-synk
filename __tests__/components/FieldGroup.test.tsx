/**
 * @jest-environment jest-environment-jsdom
 */

import '@testing-library/jest-dom';
import { render, screen } from '@testing-library/react';
import { Input, Select, Textarea } from '../../src/components/FieldGroup';

describe('components/FieldGroup', () => {

    describe('Input', () => {
        it('should render label and input correctly', () => {
            render(<Input label="Full Name" alias="fullname" placeholder="Type here" />);

            const label = screen.getByText('Full Name');
            expect(label).toBeInTheDocument();

            const input = screen.getByLabelText('Full Name');
            expect(input).toBeInTheDocument();
            expect(input).toHaveAttribute('type', 'text');
            expect(input).toHaveAttribute('name', 'fullname');
            expect(input).toHaveAttribute('placeholder', 'Type here');
        });
    });

    describe('Textarea', () => {
        it('should render label and textarea correctly', () => {
            render(<Textarea label="Description" alias="desc" rows={4} />);

            const textarea = screen.getByLabelText('Description');

            expect(textarea).toBeInTheDocument();
            expect(textarea.tagName).toBe('TEXTAREA');
            expect(textarea).toHaveAttribute('name', 'desc');
            expect(textarea).toHaveAttribute('rows', '4');
        });
    });

    describe('Select', () => {
        it('should render select with children options', () => {
            render(
                <Select label="Category" alias="category" isLoading={false}>
                    <option value="1">Option A</option>
                    <option value="2">Option B</option>
                </Select>
            );

            const select = screen.getByLabelText('Category');
            expect(select).toBeInTheDocument();
            expect(select).not.toBeDisabled();

            expect(screen.getByText('Selecione')).toBeInTheDocument();
            expect(screen.getByText('Option A')).toBeInTheDocument();
        });

        it('should handle isLoading state correctly', () => {
            const { container } = render(
                <Select label="Loading Select" alias="loading_select" isLoading={true}>
                    <option value="1">One</option>
                </Select>
            );

            const select = screen.getByLabelText('Loading Select');

            expect(select).toBeDisabled();

            const wrapper = container.querySelector('.field-group');
            expect(wrapper).toHaveClass('disabled');

            const loader = container.querySelector('.loader');
            expect(loader).not.toHaveClass('hidden');
        });

        it('should hide loader when not loading', () => {
            const { container } = render(
                <Select label="Normal Select" alias="normal" isLoading={false} />
            );

            const loader = container.querySelector('.loader');
            expect(loader).toHaveClass('hidden');
        });
    });
});