import axios from 'axios';

export interface AdConcept {
  strategy_summary: string;
  hooks: string[];
  selected_hook: string;
  script: string;
  scenes: {
    scene_number: number;
    duration_seconds: number;
    purpose: string;
    visual_description: string;
    camera_style: string;
    emotion: string;
    ai_video_prompt: string;
    caption_overlay: string;
  }[];
  voiceover_text: string;
  shotstack_edit_plan: any;
  cta: string;
}

export const generateAdConcept = async (projectData: any): Promise<AdConcept> => {
  // In a real app, this would call your backend which calls Gemini
  // For MVP, we'll use a mock response that matches the required structure
  
  console.log('Generating ad concept for:', projectData);
  
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  return {
    strategy_summary: "A high-energy, direct-to-consumer ad focusing on the problem-solution dynamic of the product.",
    hooks: [
      "Stop scrolling if you're tired of [Problem]!",
      "The secret to [Benefit] that nobody tells you.",
      "Why [Competitor] is failing you and what to do instead."
    ],
    selected_hook: "Stop scrolling if you're tired of [Problem]!",
    script: "Are you tired of [Problem]? We were too. That's why we built [Product]. It's the first [Category] designed specifically for [Audience]. Look at how easy it is to use. Just [Action] and you're done. Get yours today at the link below.",
    scenes: [
      {
        scene_number: 1,
        duration_seconds: 3,
        purpose: "Hook",
        visual_description: "Close up of a person looking frustrated with a common problem.",
        camera_style: "Handheld, shaky for urgency",
        emotion: "Frustration",
        ai_video_prompt: "Cinematic close up, person looking at a broken [Object], frustrated expression, soft natural lighting, 4k, highly detailed.",
        caption_overlay: "Tired of this?"
      },
      {
        scene_number: 2,
        duration_seconds: 5,
        purpose: "Introduction",
        visual_description: "Product reveal with sleek lighting.",
        camera_style: "Slow pan, macro lens",
        emotion: "Relief/Wonder",
        ai_video_prompt: "Macro shot of [Product], sleek design, glowing edges, studio lighting, minimalist background, 8k resolution.",
        caption_overlay: "Meet [Product]"
      },
      {
        scene_number: 3,
        duration_seconds: 7,
        purpose: "Demonstration",
        visual_description: "Person using the product effortlessly.",
        camera_style: "Medium shot, stable",
        emotion: "Satisfaction",
        ai_video_prompt: "Person using [Product] in a modern kitchen, smiling, seamless action, bright airy atmosphere, lifestyle photography style.",
        caption_overlay: "Effortless [Benefit]"
      },
      {
        scene_number: 4,
        duration_seconds: 5,
        purpose: "Benefit",
        visual_description: "Split screen showing before and after.",
        camera_style: "Static split screen",
        emotion: "Success",
        ai_video_prompt: "Split screen comparison, left side dark and messy, right side bright and organized using [Product], vibrant colors.",
        caption_overlay: "The Results Speak"
      },
      {
        scene_number: 5,
        duration_seconds: 5,
        purpose: "Social Proof",
        visual_description: "Fast cuts of happy customers.",
        camera_style: "Fast cuts, vlog style",
        emotion: "Excitement",
        ai_video_prompt: "Montage of diverse people smiling and holding [Product], outdoor setting, sunny day, high energy.",
        caption_overlay: "Join 10,000+ Users"
      },
      {
        scene_number: 6,
        duration_seconds: 5,
        purpose: "CTA",
        visual_description: "Final product shot with website URL.",
        camera_style: "Centered, static",
        emotion: "Urgency",
        ai_video_prompt: "Final hero shot of [Product], clean white background, professional product photography, soft shadows.",
        caption_overlay: "Shop Now - Link in Bio"
      }
    ],
    voiceover_text: "Are you tired of struggling with your daily routine? We were too. That's why we created the ultimate solution. Meet the new standard in quality. It's easy, it's fast, and it works. Join thousands of happy customers today. Click the link to get started.",
    shotstack_edit_plan: {
      timeline: {
        tracks: [
          { clips: [{ asset: { type: 'video', src: 'placeholder' }, start: 0, length: 30 }] }
        ]
      }
    },
    cta: "Shop Now"
  };
};
