// The provided course information.
const CourseInfo = {
  id: 451,
  name: "Introduction to JavaScript"
};

// The provided assignment group.
const AssignmentGroup = {
  id: 12345,
  name: "Fundamentals of JavaScript",
  course_id: 451,
  group_weight: 25,
  assignments: [
    {
      id: 1,
      name: "Declare a Variable",
      due_at: "2023-01-25",
      points_possible: 50
    },
    {
      id: 2,
      name: "Write a Function",
      due_at: "2023-02-27",
      points_possible: 150
    },
    {
      id: 3,
      name: "Code the World",
      due_at: "3156-11-15",
      points_possible: 500
    }
  ]
};

// The provided learner submission data.
const LearnerSubmissions = [
  {
    learner_id: 125,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-25",
      score: 47
    }
  },
  {
    learner_id: 125,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-02-12",
      score: 150
    }
  },
  {
    learner_id: 125,
    assignment_id: 3,
    submission: {
      submitted_at: "2023-01-25",
      score: 400
    }
  },
  {
    learner_id: 132,
    assignment_id: 1,
    submission: {
      submitted_at: "2023-01-24",
      score: 39
    }
  },
  {
    learner_id: 132,
    assignment_id: 2,
    submission: {
      submitted_at: "2023-03-07",
      score: 140
    }
  }
];

function getLearnerData(course, ag, submission) {
  // here, we would process this data to achieve the desired result.
  const result = [
    {
      id: 125,
      avg: 0.985, // (47 + 150) / (50 + 150)
      1: 0.94, // 47 / 50
      2: 1.0 // 150 / 150
    },
    {
      id: 132,
      avg: 0.82, // (39 + 125) / (50 + 150)
      1: 0.78, // 39 / 50
      2: 0.833 // late: (140 - 15) / 150
    }
  ];

  return result;
}

const result = getLearnerData(CourseInfo, AssignmentGroup, LearnerSubmissions);

// console.log(result);

// Helper Functions ----

// function isValidNumber(value) {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}


function getLearnerData(course, assignmentGroup, submissions) {
  try {
    // Validate assignmentGroup belongs to the course
    if (assignmentGroup.course_id !== course.id) {
      throw new Error("Assignment group does not belong to the provided course.");
    }

    const now = new Date();
    const validAssignments = {};

    // Filter out future assignments and validate points_possible
    for (const assignment of assignmentGroup.assignments) {
      const dueDate = new Date(assignment.due_at);

      if (isNaN(dueDate.getTime())) {
        throw new Error(`Invalid due date for assignment ID ${assignment.id}`);
      }

      if (dueDate > now) continue; // Exclude future assignments

      const pointsPossible = Number(assignment.points_possible);
      if (!isValidNumber(pointsPossible) || pointsPossible <= 0) {
        throw new Error(`Invalid points_possible for assignment ID ${assignment.id}`);
      }

      validAssignments[assignment.id] = {
        pointsPossible,
        dueDate,
      };
    }

    const learnerMap = {};

    for (const submission of submissions) {
      const { learner_id, assignment_id, submission: sub } = submission;

      const assignment = validAssignments[assignment_id];
      if (!assignment) continue; // Skip assignments that are invalid or not yet due

      const { pointsPossible, dueDate } = assignment;

      let score = Number(sub.score);
      if (!isValidNumber(score)) {
        throw new Error(`Invalid score for learner ${learner_id} on assignment ${assignment_id}`);
      }

      const submittedDate = new Date(sub.submitted_at);
      if (isNaN(submittedDate.getTime())) {
        throw new Error(`Invalid submitted_at date for learner ${learner_id}`);
      }

      // Apply 10% late penalty
      if (submittedDate > dueDate) {
        score -= pointsPossible * 0.1;
        if (score < 0) score = 0;
      }

      const normalizedScore = score / pointsPossible;

      // Initialize learner entry if needed
      if (!learnerMap[learner_id]) {
        learnerMap[learner_id] = {
          id: learner_id,
          totalScore: 0,
          totalPossible: 0,
        };
      }

      learnerMap[learner_id][assignment_id] = Number(normalizedScore.toFixed(3));
      learnerMap[learner_id].totalScore += score;
      learnerMap[learner_id].totalPossible += pointsPossible;
    }

    // Format final output
    const result = Object.values(learnerMap).map(learner => {
      learner.avg = Number((learner.totalScore / learner.totalPossible).toFixed(3));
      delete learner.totalScore;
      delete learner.totalPossible;
      return learner;
    });

    return result;
  } catch (error) {
    console.error("Error in getLearnerData:", error.message);
    return [];
  }
}
console.log(result);


