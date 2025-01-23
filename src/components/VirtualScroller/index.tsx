import { IVirtualScrollerProps } from './props'
import useVirtual from 'react-cool-virtual'
import './index.scss'
import { useEffect, useMemo, useRef, useState } from 'react'
import { commonComponentClasses } from '@/lib'
import cn from 'classnames'

export const VirtualScroller = <T extends any>({
  items,
  itemSize,
  renderItem,
  columnCount = 1,
  ...props
}: IVirtualScrollerProps<T>) => {
  const rows = useMemo(
    () =>
      items.reduce<T[][]>((resultArray, item, index) => {
        const chunkIndex = Math.floor(index / columnCount)

        if (!resultArray[chunkIndex]) {
          resultArray[chunkIndex] = [] // start a new chunk
        }

        resultArray[chunkIndex].push(item)

        return resultArray
      }, []),
    [items, columnCount]
  )

  const virtualScroll = useVirtual({ itemCount: rows.length, itemSize: itemSize + 12 })
  const [containerHeight, setContainerHeight] = useState(0)
  const containerRef = useRef<HTMLDivElement>(null)

  const onWindowResize = () => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight)
    }
  }

  useEffect(() => {
    if (containerRef.current) {
      setContainerHeight(containerRef.current.clientHeight)
    }

    window.addEventListener('resize', onWindowResize)

    return () => {
      window.removeEventListener('resize', onWindowResize)
    }
  }, [])

  return (
    <div ref={containerRef} className={cn('virtual-scroller', commonComponentClasses(props))}>
      <div
        ref={virtualScroll.outerRef as any}
        className="virtual-scroller__outer"
        style={{ height: `${containerHeight}px` }}
      >
        <div ref={virtualScroll.innerRef as any} className="virtual-scroller__inner">
          {virtualScroll.items.map((item) => (
            <div className="virtual-scroller__row">
              {rows[item.index]?.map((cell) => (
                <div
                  className="virtual-scroller__cell"
                  style={{ width: `calc((100% + 0.5rem) / ${columnCount} - 0.5rem)` }}
                >
                  {renderItem(cell)}
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
