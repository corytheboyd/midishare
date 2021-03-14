import React, { useMemo } from "react";
import { Chrome } from "../Chrome";

const QuestionAnswerNode: React.FC<{
  question: JSX.Element | string;
  answer: JSX.Element | string;
}> = (props) => {
  return (
    <div className="space-y-2">
      <h3 className="text-gray-400 italic border-l-4 pl-2">{props.question}</h3>
      <div className="text-sm pl-2 space-y-2">{props.answer}</div>
    </div>
  );
};

export const HomePage: React.FC = () => {
  const exampleImageUrl = useMemo(() => {
    const url = new URL(process.env.STATIC_CDN_URL as string);
    url.pathname = "/example-image.png";
    return url.toString();
  }, []);

  return (
    <Chrome>
      <article className="bg-gray-900 px-4 flex flex-col items-center pb-10">
        <div className="space-y-5 pt-4 flex flex-col items-center text-center">
          <h1 className="font-serif font-bold text-3xl text-gray-200">
            Keyboard sharing for remote music lessons
          </h1>

          <div className="space-y-4 text-gray-400">
            <p className="text-md">
              You don't need complicated camera rigging for music lessons
              anymore
            </p>
            <p className="text-md">
              With Midishare, teacher and student see the entire range of each
              other's playing in real time
            </p>
          </div>

          <img
            className="md:max-w-xl lg:max-w-3xl"
            src={exampleImageUrl}
            alt="Example screenshot of Midishare"
          />
        </div>

        <div className="max-w-3xl">
          <h2 className="text-center text-xl font-bold text-gray-300 mt-2 mb-3">
            FAQs
          </h2>

          <div className="text-gray-300 space-y-3">
            <QuestionAnswerNode
              question="Does Midishare offer lessons?"
              answer={
                <p>
                  No, at this time Midishare does not offer music lessons. If
                  you're getting started and are looking for lessons, don't be
                  shy and check out your local schools!
                </p>
              }
            />
            <QuestionAnswerNode
              question="Do I use Midishare instead of Zoom?"
              answer={
                <>
                  <p>
                    No, at this time Midishare does not replace Zoom (or any
                    other video conferencing provider). If you already use Zoom
                    for lessons, you will run Zoom and then open Midishare,
                    running them both at the same time.
                  </p>
                </>
              }
            />
            <QuestionAnswerNode
              question="What does they Midishare keyboard sound like?"
              answer={
                <>
                  <p>
                    The Midishare keyboard does not play audio at this time. For
                    lessons, continue to play instrument audio over your video
                    call.
                  </p>
                </>
              }
            />
            <QuestionAnswerNode
              question="Do I need a MIDI keyboard to use this?"
              answer={
                <>
                  <p>
                    A MIDI keyboard is not required to participate in a
                    Midishare session. You only need to have a MIDI keyboard if
                    you want to stream your playing to the other participant.
                  </p>
                </>
              }
            />
            <QuestionAnswerNode
              question="Can I have all of my students in one session?"
              answer={
                <>
                  <p>
                    No, currently Midishare only connects two people per
                    session, typically a teacher and a student engaged in remote
                    music lessons.
                  </p>
                </>
              }
            />
            <QuestionAnswerNode
              question="Can this only be used for music lessons?"
              answer={
                <>
                  <p>
                    No, not necessarily, so long as you want to connect the MIDI
                    keyboards of any two people into the same web page,
                    Midishare will work!
                  </p>
                </>
              }
            />
          </div>
        </div>
      </article>
    </Chrome>
  );
};
