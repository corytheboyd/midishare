import React from "react";
import { Chrome } from "../Chrome";

export const HomePage: React.FC = () => {
  return (
    <Chrome>
      <article className="flex flex-col items-center">
        <div className="text-center pb-5 max-w-3xl">
          <h1 className="font-serif font-bold text-5xl mt-8">
            Remote keyboard sharing for teachers and students
          </h1>
          <p>
            You and your students don't need complicated camera rigging for
            lessons.
          </p>
          <p>
            With Midishare, teacher and student see every key press one another
            in real time.
          </p>
          <h2>FAQs</h2>
          <h3>Does Midishare offer music lessons?</h3>
          <p>
            No, at this time Midishare does not offer music lessons. If you're
            getting started and are looking for lessons, don't be shy and check
            out your local schools!
          </p>
          <h3>Do I use Midishare instead of Zoom?</h3>
          <p>
            No, at this time Midishare does not replace Zoom (or any other video
            conferencing provider). If you already use Zoom for lessons, you
            will run Zoom and then open Midishare, running them both at the same
            time. As a student, for example, you would look at Zoom to see your
            teachers video (audio comes from zoom as well), and you would look
            at Midishare to see their playing.
          </p>
          <p>
            In the near future, Midishare will be able to replace Zoom as the
            only program needed for your lessions.
          </p>
          <h3>What does they Midishare keyboard sound like?</h3>
          <p>
            The Midishare keyboard does not play audio when the MIDI keyboard is
            played at this time. You can simply play instrument audio over your
            Zoom call for now, which is likely what you already do for your
            lessons.
          </p>
          <p>
            The main reason it was avoid at first was to minimize the potential
            for Midishare keyboard sound to feed back into the Zoom call audio,
            creating a poor experience for all. That doesn't mean it's not
            possible, it will be reconsidered when Midishare Audio/Video is
            worked on.
          </p>
          <h3>Do I need a MIDI keyboard?</h3>
          <p>
            A MIDI keyboard isn't required to participate in a Midishare
            session. You only need to have a MIDI keyboard if you want to stream
            your playing to the other participant.
          </p>
          <p>
            For example, Midishare can simply be used by a teacher to stream
            their playing to a student, without requiring the student worry
            about setting up a keyboard with Midishare.
          </p>
          <h3>Can I use this to teach a full classroom?</h3>
          <p>
            No, currently Midishare only connects two people per session,
            typically a teacher and a student engaged in remote music lessons.
          </p>
          <h3>So is it educational only?</h3>
          <p>
            No, not necessarily, so long as you want to connect the MIDI
            keyboards of any two people into the same web page, Midishare will
            work!
          </p>
        </div>
      </article>
    </Chrome>
  );
};
