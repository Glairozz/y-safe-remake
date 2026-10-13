export const lessons = {
  'bandage-parts': {
    title: 'Parts of Triangular Bandage',
    content: `
      <h3>Parts of Triangular Bandage</h3>
      <p>A triangular bandage is a versatile first aid tool that can be used in various emergency situations. Understanding its parts is essential for proper application.</p>
      
      <h4>Main Parts:</h4>
      <ul>
        <li><strong>Base:</strong> The longest edge of triangular bandage</li>
        <li><strong>Apex:</strong> The point opposite base</li>
        <li><strong>Edges:</strong> The two sides that form triangle</li>
        <li><strong>Corners:</strong> Three points including apex and two base corners</li>
      </ul>
      
      <h4>Uses:</h4>
      <ul>
        <li>Creating arm slings</li>
        <li>Securing dressings</li>
        <li>Immobilizing injuries</li>
        <li>Applying pressure to wounds</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What is the longest edge of a triangular bandage called?',
        options: ['Apex', 'Base', 'Edge', 'Corner'],
        correct: 1
      },
      {
        question: 'What is the point opposite the base called?',
        options: ['Corner', 'Edge', 'Apex', 'Side'],
        correct: 2
      },
      {
        question: 'How many corners does a triangular bandage have?',
        options: ['Two', 'Three', 'Four', 'Five'],
        correct: 1
      },
      {
        question: 'What is one common use of a triangular bandage?',
        options: ['Creating arm slings', 'Cleaning wounds', 'Taking temperature', 'Measuring blood pressure'],
        correct: 0
      },
      {
        question: 'What are the two sides that form a triangle called?',
        options: ['Base and apex', 'Edges', 'Corners', 'Sides'],
        correct: 1
      }
    ]
  },
  'bandage-folds': {
    title: 'Triangular Bandage Folds',
    content: `
      <h3>Triangular Bandage Folds</h3>
      <p>Different folding techniques allow the triangular bandage to be used for various emergency situations.</p>
      
      <h4>Common Folds:</h4>
      <ul>
        <li><strong>Cravat fold:</strong> Narrow bandage for wrapping</li>
        <li><strong>Broad fold:</strong> Wide bandage for large areas</li>
        <li><strong>Saddle fold:</strong> Special shape for specific applications</li>
        <li><strong>Triangle fold:</strong> Compact for small injuries</li>
      </ul>
      
      <h4>Applications:</h4>
      <ul>
        <li>Cravat fold for limb bandaging</li>
        <li>Broad fold for chest or back injuries</li>
        <li>Saddle fold for shoulder injuries</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What is the purpose of a cravat fold?',
        options: ['For wrapping injuries', 'For cleaning wounds', 'For measuring temperature', 'For taking blood pressure'],
        correct: 0
      },
      {
        question: 'Which fold is best for large areas?',
        options: ['Cravat fold', 'Broad fold', 'Saddle fold', 'Triangle fold'],
        correct: 1
      },
      {
        question: 'What fold is used for shoulder injuries?',
        options: ['Cravat fold', 'Broad fold', 'Saddle fold', 'Triangle fold'],
        correct: 2
      }
    ]
  },
  'square-knot': {
    title: 'Square Knot',
    content: `
      <h3>Square Knot</h3>
      <p>A proper square knot is essential for securing bandages safely and effectively.</p>
      
      <h4>Steps to Tie Square Knot:</h4>
      <ul>
        <li>Cross right end over left end</li>
        <li>Pass right end under and through loop</li>
        <li>Cross left end over right end</li>
        <li>Pass left end under and through loop</li>
        <li>Tighten by pulling both ends</li>
      </ul>
      
      <h4>Key Points:</h4>
      <ul>
        <li>Hold ends firmly while tying</li>
        <li>Ensure knot is flat and secure</li>
        <li>Don't make it too tight</li>
        <li>Practice regularly to master</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What is the first step in tying a square knot?',
        options: ['Cross right over left', 'Cross left over right', 'Make a loop', 'Tie a bow'],
        correct: 0
      }
    ]
  },
  'head-wound': {
    title: 'Wound Top of Head',
    content: `
      <h3>Wound Top of Head</h3>
      <p>Head injuries require careful attention and proper bandaging technique.</p>
      
      <h4>Bandaging Steps:</h4>
      <ul>
        <li>Place center of bandage over wound</li>
        <li>Bring ends down around head</li>
        <li>Cross ends at back of head</li>
        <li>Tie with square knot on side</li>
        <li>Ensure firm but not too tight</li>
      </ul>
      
      <h4>Important Notes:</h4>
      <ul>
        <li>Check for concussion symptoms</li>
        <li>Don't apply pressure to skull fractures</li>
        <li>Monitor breathing and consciousness</li>
        <li>Seek medical help immediately</li>
      </ul>
    `,
    quiz: [
      {
        question: 'Where should the center of the bandage be placed for a head wound?',
        options: ['On the forehead', 'Over the wound', 'On the back of head', 'On the neck'],
        correct: 1
      }
    ]
  },
  'forearm-wound': {
    title: 'Wound on Forearm',
    content: `
      <h3>Wound on Forearm</h3>
      <p>Forearm injuries need proper bandaging to control bleeding and prevent infection.</p>
      
      <h4>Bandaging Technique:</h4>
      <ul>
        <li>Clean wound thoroughly</li>
        <li>Apply dressing pad</li>
        <li>Wrap bandage spiral fashion</li>
        <li>Overlap each turn by half</li>
        <li>Secure with square knot</li>
      </ul>
      
      <h4>Tips:</h4>
      <ul>
        <li>Start below and wrap upward</li>
        <li>Check circulation below bandage</li>
        <li>Don't wrap too tightly</li>
      </ul>
    `,
    quiz: [
      {
        question: 'How should you wrap a forearm wound?',
        options: ['Tightly', 'Spiral fashion with overlap', 'Randomly', 'In circles'],
        correct: 1
      }
    ]
  },
  'hand-burn': {
    title: 'Burn on Hand',
    content: `
      <h3>Burn on Hand</h3>
      <p>Hand burns require careful treatment to prevent infection and promote healing.</p>
      
      <h4>Immediate Treatment:</h4>
      <ul>
        <li>Cool burn with cool water</li>
        <li>Don't apply ice directly</li>
        <li>Don't break blisters</li>
        <li>Cover with sterile dressing</li>
        <li>Seek medical help for severe burns</li>
      </ul>
      
      <h4>Bandaging:</h4>
      <ul>
        <li>Use non-stick dressing</li>
        <li>Wrap gently, not tightly</li>
        <li>Elevate hand to reduce swelling</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What should you NOT do for a hand burn?',
        options: ['Cool with water', 'Apply ice directly', 'Cover with dressing', 'Break blisters'],
        correct: 1
      }
    ]
  },
  'arm-sling': {
    title: 'Arm Sling',
    content: `
      <h3>Arm Sling</h3>
      <p>An arm sling provides support and immobilization for arm injuries.</p>
      
      <h4>Creating an Arm Sling:</h4>
      <ul>
        <li>Fold triangular bandage into cravat</li>
        <li>Place one end over shoulder</li>
        <li>Support injured arm at elbow</li>
        <li>Bring other end around neck</li>
        <li>Tie square knot above collarbone</li>
      </ul>
      
      <h4>Adjustment:</h4>
      <ul>
        <li>Ensure comfortable height</li>
        <li>Check circulation in fingers</li>
        <li>Secure knot properly</li>
      </ul>
    `,
    quiz: [
      {
        question: 'What type of knot is used to secure an arm sling?',
        options: ['Bow knot', 'Square knot', 'Loop knot', 'Slip knot'],
        correct: 1
      }
    ]
  },
  'face-burn': {
    title: 'Burn in Face and/or Back of Head',
    content: `
      <h3>Burn in Face and/or Back of Head</h3>
      <p>Facial and head burns require special care due to sensitive areas.</p>
      
      <h4>Treatment Approach:</h4>
      <ul>
        <li>Cool with water or wet cloth</li>
        <li>Don't apply ointments</li>
        <li>Don't break blisters</li>
        <li>Cover loosely with sterile dressing</li>
      </ul>
      
      <h4>Special Considerations:</h4>
      <ul>
        <li>Protect airway</li>
        <li>Monitor for shock</li>
        <li>Seek immediate medical attention</li>
        <li>Don't apply pressure if skull fracture suspected</li>
      </ul>
    `,
    quiz: [
      {
        question: 'How should you cover a face burn?',
        options: ['Tightly', 'With pressure', 'Loosely with sterile dressing', 'With plastic wrap'],
        correct: 2
      }
    ]
  }
};
