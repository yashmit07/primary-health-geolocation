import { SocialProgram } from '@/types';

interface ResultsListProps {
  programs: SocialProgram[];
  selectedId: number | null;
  onSelect: (id: number | null) => void;
}

function ProgramItem({ 
  program, 
  isSelected, 
  onClick 
}: { 
  program: SocialProgram; 
  isSelected: boolean; 
  onClick: () => void; 
}) {
  return (
    <div 
      className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
        isSelected ? 'bg-blue-50' : ''
      }`}
      onClick={onClick}
    >
      <h3 className="font-medium text-black">{program.name}</h3>
      <p className="text-sm text-gray-600">
        {program.types?.length > 0 
          ? program.types.join(', ')
          : 'No types specified'}
      </p>
      <a 
        href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(program.address)}`}
        target="_blank"
        rel="noopener noreferrer"
        className="text-sm text-blue-600 hover:underline mt-1 block"
        onClick={(e) => e.stopPropagation()}
      >
        {program.address}
      </a>
    </div>
  );
}

export default function ResultsList({ programs, selectedId, onSelect }: ResultsListProps) {
  return (
    <div className="bg-white rounded-lg shadow">
      <div className="p-4 border-b">
        <h2 className="font-medium text-black">Found {programs.length} Programs</h2>
      </div>
      <div className="max-h-[500px] overflow-y-auto">
        {programs.map((program) => (
          <ProgramItem
            key={program.id}
            program={program}
            isSelected={selectedId === program.id}
            onClick={() => onSelect(program.id)}
          />
        ))}
      </div>
    </div>
  );
}