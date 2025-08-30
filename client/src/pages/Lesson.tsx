import AudioMatch from '../components/AudioMatch';
import DragandDrop from '../components/DragDrop';
import MatchDots from '../components/MatchDots';


const Lesson: React.FC = () => {
return (
<>
<div>
<AudioMatch />
</div>
<div>
<DragandDrop />
</div>
<div>
<MatchDots />
</div>
</>
);
};


export default Lesson;