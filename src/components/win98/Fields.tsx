import type {
  InputHTMLAttributes,
  ReactNode,
  SelectHTMLAttributes,
  TextareaHTMLAttributes,
} from 'react';

/**
 * Campos de formulário 98. O site não tem formulário próprio (as inscrições são no
 * Google Forms), mas os componentes ficam prontos para uso futuro.
 */

export function Field({
  label,
  row,
  children,
}: {
  /** Com dois-pontos: "Nome completo:". */
  label: ReactNode;
  row?: boolean;
  children: ReactNode;
}) {
  return (
    <label className={['w98-field', row && 'is-row'].filter(Boolean).join(' ')}>
      {label}
      {children}
    </label>
  );
}

export function Input(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={['w98-input', props.className].filter(Boolean).join(' ')} />;
}

export function Select(props: SelectHTMLAttributes<HTMLSelectElement>) {
  return (
    <select {...props} className={['w98-select', props.className].filter(Boolean).join(' ')} />
  );
}

export function TextArea(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return (
    <textarea {...props} className={['w98-textarea', props.className].filter(Boolean).join(' ')} />
  );
}

export function Check({
  label,
  radio,
  ...rest
}: { label: ReactNode; radio?: boolean } & Omit<InputHTMLAttributes<HTMLInputElement>, 'type'>) {
  return (
    <label className={radio ? 'w98-radio' : 'w98-check'}>
      <input type={radio ? 'radio' : 'checkbox'} {...rest} />
      <span>{label}</span>
    </label>
  );
}

export function GroupBox({ legend, children }: { legend: ReactNode; children: ReactNode }) {
  return (
    <fieldset className="w98-groupbox">
      <legend>{legend}</legend>
      {children}
    </fieldset>
  );
}
