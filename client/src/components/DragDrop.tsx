import React, { useRef } from 'react';


const DragDrop: React.FC = () => {
const draggedItem = useRef<HTMLElement | null>(null);
const sourceContainer = useRef<HTMLElement | null>(null);


const handleDragStart = (event: React.DragEvent<HTMLDivElement>) => {
draggedItem.current = event.currentTarget;
sourceContainer.current = event.currentTarget.parentElement as HTMLElement;
event.dataTransfer.setData("text/plain", event.currentTarget.dataset.id || '');
};


const allowDrop = (event: React.DragEvent<HTMLDivElement>) => {
event.preventDefault();
};


const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
event.preventDefault();
const target = event.currentTarget;


if (!draggedItem.current || !sourceContainer.current) return;

const itemId = draggedItem.current.dataset.id;

if (sourceContainer.current.id === 'bank') {
  const clone = draggedItem.current.cloneNode(true) as HTMLElement;
  clone.draggable = true;
  clone.addEventListener('dragstart', (e) =>
    handleDragStart(e as unknown as React.DragEvent<HTMLDivElement>)
  );
  target.appendChild(clone);
} else if (sourceContainer.current.id === 'list' && target.id === 'bank') {
  draggedItem.current.remove();
}

draggedItem.current = null;
sourceContainer.current = null;

};


return (
<div style={styles.container}>
<h3>Type the letters according to what you hear</h3>


  <img src="img.jpg" alt="Visual hint" style={styles.image} />
  <img src="audio.jpg" alt="Audio icon" style={styles.image} />
  <p>"good"</p>

  {/* Drop zone */}
  <div id="list" onDragOver={allowDrop} onDrop={handleDrop} style={styles.dropZone}>
    {/* Dropped items appear here */}
  </div>

  {/* Letter bank */}
  <div id="bank" onDragOver={allowDrop} onDrop={handleDrop} style={styles.bank}>
    {['あ', 'い', 'う'].map((char, idx) => (
      <div
        key={idx}
        className="item"
        data-id={String(idx + 1)}
        draggable
        onDragStart={handleDragStart}
        style={styles.item}
      >
        {char}
      </div>
    ))}
  </div>
</div>

);
};


const styles: { [key: string]: React.CSSProperties } = {
container: {
fontFamily: 'Arial, sans-serif',
textAlign: 'center',
display: 'flex',
flexDirection: 'column',
width: '100vw',
alignItems: 'center',
marginTop: '40px',
},
image: {
width: '200px',
height: 'auto',
margin: '10px 0',
},
dropZone: {
width: '50vw',
minWidth: '300px',
maxWidth: '400px',
height: '90px',
border: '4px solid #ccc',
borderRadius: '8px',
display: 'flex',
justifyContent: 'center',
flexDirection: 'row',
padding: '10px',
backgroundColor: '#f9f9f9',
marginBottom: '20px',
},
bank: {
width: '50vw',
height: '90px',
display: 'flex',
justifyContent: 'space-between',
borderRadius: '8px',
padding: '10px',
backgroundColor: '#f9f9f9',
},
item: {
padding: '10px',
width: '60px',
height: '50px',
margin: '10px',
border: '2px solid #ccc',
borderRadius: '4px',
cursor: 'grab',
fontSize: '30px',
userSelect: 'none',
},
};


export default DragDrop;