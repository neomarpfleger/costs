import styles from './Select.module.css'

function Select({ text, name, options, handleOnChange, value }) {
    return (
        <div className={styles.form_control}>
            <label htmlFor={name}>{text}:</label>
            <select
                name={name}
                id={name}
                onChange={handleOnChange}
                value={value || ''}
                aria-label={text}  // Melhora a acessibilidade
            >
                <option value="" disabled>Selecione uma opção</option>
                {options && options.length > 0 ? (
                    options.map((option) => (
                        <option value={option.id} key={option.id}>
                            {option.name}
                        </option>
                    ))
                ) : (
                    <option disabled>Nenhuma opção disponível</option>
                )}
            </select>
        </div>
    )
}

export default Select;

