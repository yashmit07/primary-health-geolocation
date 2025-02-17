import { SocialProgram } from '../types';
import styles from './ResultsList.module.scss';

interface ResultsListProps {
  programs: SocialProgram[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

export default function ResultsList({ programs, selectedId, onSelect }: ResultsListProps) {
  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2 className={styles.headerTitle}>Found {programs.length} Programs</h2>
      </div>
      <div className={styles.list}>
        {programs.map((program) => (
          <div 
            key={program.id}
            className={`${styles.listItem} ${selectedId === program.id ? styles.selected : ''}`}
            onClick={() => onSelect(program.id)}
          >
            <h3 className={styles.programName}>{program.name}</h3>
            <p className={styles.programTypes}>
              {program.types?.length > 0 
                ? program.types.join(', ')
                : 'No types specified'
              }
            </p>
            <a 
              href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(program.address)}`}
              target="_blank"
              rel="noopener noreferrer"
              className={styles.programAddress}
              onClick={(e) => e.stopPropagation()}
            >
              {program.address}
            </a>
          </div>
        ))}
      </div>
    </div>
  );
}