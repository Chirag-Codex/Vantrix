import { cn } from '@/lib/utils';

export function SlideIndicators({ totalSlides, currentSlide, onChangeSlide }) {
  return (
    <div
      role="tablist"
      aria-label="Hero slide navigation"
      className="flex flex-col items-center gap-[18px]"
    >
      {Array.from({ length: totalSlides }).map((_, index) => {
        const isActive = index === currentSlide;
        return (
          <button
            key={index}
            role="tab"
            type="button"
            aria-selected={isActive}
            aria-label={`Go to slide ${index + 1}`}
            onClick={() => onChangeSlide(index)}
            className="group relative flex cursor-pointer items-center justify-center focus:outline-none"
          >
            <span
              className={cn(
                'block h-2 w-2 rounded-full transition-all duration-200',
                isActive
                  ? 'bg-[var(--text)] ring-[5px] ring-[var(--line-strong)]'
                  : 'bg-[var(--muted2)] hover:bg-[var(--text)]'
              )}
            />
          </button>
        );
      })}
    </div>
  );
}
