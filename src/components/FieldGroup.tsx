import '../styles/components/field-group.css';
import type {
  DetailedHTMLProps,
  InputHTMLAttributes,
  SelectHTMLAttributes, TextareaHTMLAttributes
} from 'react';

export type InputProps = {
  label: string;
  alias: string;
} & DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>;

export type SelectProps = {
  label: string;
  alias: string;
  isLoading: boolean;
} & DetailedHTMLProps<SelectHTMLAttributes<HTMLSelectElement>, HTMLSelectElement>;

export type TextareaProps = {
  label: string;
  alias: string;
} & DetailedHTMLProps<TextareaHTMLAttributes<HTMLTextAreaElement>, HTMLTextAreaElement>;

export function Input({ label, alias, ...rest }: InputProps) {
  return (
    <div className="field-group">
      <label htmlFor={alias}>{label}</label>
      <input type="text" name={alias} id={alias} {...rest} />
    </div>
  );
}

export function Select({ label, alias, isLoading, children, ...rest }: SelectProps) {
  return (
    <div className={`field-group ${isLoading ? 'disabled' : ''}`}>
      <div className={`loader ${!isLoading ? 'hidden' : ''}`}></div>
      <label htmlFor={alias}>{label}</label>
      <select name={alias} id={alias} defaultValue="" disabled={isLoading} {...rest}>
        <option value="" disabled>Selecione</option>

        {children}
      </select>
    </div>
  );
}

export function Textarea({ label, alias, ...rest }: TextareaProps) {
  return (
    <div className="field-group">
      <label htmlFor={alias}>{label}</label>
      <textarea name={alias} id={alias} {...rest}></textarea>
    </div>
  );
}